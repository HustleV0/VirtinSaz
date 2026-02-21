from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import exceptions, filters, generics, permissions, viewsets
from rest_framework.response import Response

from .models import Product, ProductCategory, ProductTag
from .serializers import ProductCategorySerializer, ProductSerializer, ProductTagSerializer


class PublicMenuDataView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(cache_page(60 * 15))
    def get(self, request, slug=None):
        tenant = getattr(request, 'tenant', None)
        if not tenant or not tenant.site_id:
            return Response({'detail': 'Tenant not found'}, status=404)

        site = tenant.site
        if not site.is_plugin_active('menu'):
            return Response(
                {
                    'categories': [],
                    'products': [],
                    'plugin_inactive': True,
                }
            )

        categories = ProductCategory.objects.filter(tenant=tenant, is_active=True).order_by('order')
        products = Product.objects.filter(tenant=tenant).order_by('order')

        return Response(
            {
                'categories': ProductCategorySerializer(categories, many=True, context={'request': request}).data,
                'products': ProductSerializer(products, many=True, context={'request': request}).data,
            }
        )


class SiteSpecificMixin:
    """
    Enforces tenant scoping from request host and sets tenant/site on create.
    """

    def get_tenant(self):
        tenant = getattr(self.request, 'tenant', None)
        user = self.request.user
        if not tenant and user.is_authenticated and user.tenant_id:
            tenant = user.tenant
        if not tenant:
            raise exceptions.NotFound('Tenant not found.')

        if user.is_authenticated and user.tenant_id and user.tenant_id != tenant.id:
            raise exceptions.PermissionDenied('Tenant mismatch for this user.')

        return tenant

    def get_site(self, tenant):
        site = getattr(tenant, 'site', None)
        if not site:
            raise exceptions.NotFound('Tenant site is not configured.')
        return site

    def get_queryset(self):
        tenant = self.get_tenant()
        site = self.get_site(tenant)

        if not site.is_plugin_active('menu'):
            return self.queryset.none()

        return self.queryset.filter(tenant=tenant)

    @transaction.atomic
    def perform_create(self, serializer):
        tenant = self.get_tenant()
        site = self.get_site(tenant)

        if not site.is_plugin_active('menu'):
            raise exceptions.PermissionDenied('Menu plugin is not active for this tenant.')

        serializer.save(site=site, tenant=tenant)


class ProductTagViewSet(SiteSpecificMixin, viewsets.ModelViewSet):
    queryset = ProductTag.objects.all()
    serializer_class = ProductTagSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductCategoryViewSet(SiteSpecificMixin, viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering_fields = ['order', 'name']


class ProductViewSet(SiteSpecificMixin, viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('category').prefetch_related('tags')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'price', 'created_at']
