from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .models import SiteCategory, Theme, Site
from .serializers import SiteCategorySerializer, ThemeSerializer, SiteSerializer, SignupSerializer

class SiteCategoryListView(generics.ListAPIView):
    queryset = SiteCategory.objects.filter(is_active=True)
    serializer_class = SiteCategorySerializer
    permission_classes = [permissions.AllowAny]

class ThemeListView(generics.ListAPIView):
    serializer_class = ThemeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Theme.objects.filter(is_active=True)
        category_id = self.request.query_params.get('category_id')
        if category_id:
            try:
                category = SiteCategory.objects.get(id=category_id)
                from django.db.models import Q
                queryset = queryset.filter(
                    Q(category_id=category_id) | Q(site_types__contains=category.slug)
                )
            except SiteCategory.DoesNotExist:
                queryset = queryset.filter(category_id=category_id)
        return queryset

class ThemeDetailView(generics.RetrieveAPIView):
    queryset = Theme.objects.filter(is_active=True)
    serializer_class = ThemeSerializer
    permission_classes = [permissions.AllowAny]

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        site = serializer.save()
        return Response({
            "user_id": site.owner.id,
            "site_id": site.id,
            "tokens": serializer.data.get("tokens")
        }, status=status.HTTP_201_CREATED)

class SiteMeView(generics.RetrieveAPIView):
    serializer_class = SiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.sites.first()

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response({"detail": "No site found for this user."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class SiteCreateView(generics.CreateAPIView):
    serializer_class = SiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Get data from validated_data or request.data
        validated_data = serializer.validated_data
        
        # Set slug if not in validated_data
        slug = validated_data.get('slug')
        if not slug:
            from django.utils.text import slugify
            name = validated_data.get('name', self.request.data.get('name'))
            slug = slugify(name, allow_unicode=True)
            
        # Get theme default settings
        theme = validated_data.get('theme')
        default_settings = {}
        if theme:
            default_settings = theme.default_settings

        serializer.save(owner=self.request.user, slug=slug, settings=default_settings)

class SitePublicView(generics.RetrieveAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class DebugSlugsView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        return Response([(s.name, s.slug) for s in Site.objects.all()])

class SiteSettingsUpdateView(generics.UpdateAPIView):
    serializer_class = SiteSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['patch']

    def get_object(self):
        return self.request.user.sites.first()

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response({"detail": "No site found for this user."}, status=status.HTTP_404_NOT_FOUND)
        
        # 1. Handle Theme Update
        theme_id = request.data.get('theme_id')
        if theme_id:
            try:
                new_theme = Theme.objects.get(id=theme_id, is_active=True)
                # Check if theme supports this category
                if new_theme.category_id != instance.category_id and instance.category.slug not in (new_theme.site_types or []):
                    return Response(
                        {"detail": "This theme does not support your site type."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                instance.theme = new_theme
                # Merge new theme default settings with existing settings
                if isinstance(new_theme.default_settings, dict) and isinstance(instance.settings, dict):
                    merged_settings = new_theme.default_settings.copy()
                    merged_settings.update(instance.settings)
                    instance.settings = merged_settings
                else:
                    instance.settings = new_theme.default_settings
            except Theme.DoesNotExist:
                return Response({"detail": "Theme not found or inactive."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Handle Settings Update
        settings_data = request.data.get('settings')
        if settings_data is not None:
            if isinstance(settings_data, str):
                import json
                try:
                    settings_data = json.loads(settings_data)
                except json.JSONDecodeError:
                    pass
            instance.settings = settings_data
            
        # 3. Handle General Info Update
        name = request.data.get('name')
        if name:
            instance.name = name

        # 4. Handle Logo Update
        logo = request.FILES.get('logo')
        if logo:
            instance.logo = logo

        # 5. Handle Cover Image Update
        cover_image = request.FILES.get('cover_image')
        if cover_image:
            instance.cover_image = cover_image

        instance.save()
        return Response(self.get_serializer(instance).data)

