from rest_framework import viewsets, permissions, filters, exceptions, generics
from rest_framework.response import Response
from .models import ProductTag, ProductCategory, Product
from .serializers import ProductTagSerializer, ProductCategorySerializer, ProductSerializer
from sites.models import Site, SiteCategory, Theme

class PublicMenuDataView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, slug):
        try:
            site = Site.objects.get(slug=slug)
            categories = ProductCategory.objects.filter(site=site, is_active=True).order_by('order')
            products = Product.objects.filter(site=site, is_available=True).order_by('order')
            
            return Response({
                "categories": ProductCategorySerializer(categories, many=True, context={'request': request}).data,
                "products": ProductSerializer(products, many=True, context={'request': request}).data
            })
        except Site.DoesNotExist:
            return Response({"detail": "Site not found"}, status=404)

class SiteSpecificMixin:
    """
    Ensures that the queryset is filtered by the user's site
    and sets the site field on creation.
    """
    def get_queryset(self):
        site = Site.get_or_create_for_user(self.request.user)
        if not site:
            return self.queryset.none()
        return self.queryset.filter(site=site)

    def perform_create(self, serializer):
        site = Site.get_or_create_for_user(self.request.user)
        if not site:
            raise exceptions.PermissionDenied("User has no associated site.")
        serializer.save(site=site)

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
    # Removed DjangoFilterBackend due to python 3.14 compatibility issues with django-filter
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'price', 'created_at']

