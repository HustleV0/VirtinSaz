from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .models import SiteCategory, Template, Site
from .serializers import SiteCategorySerializer, TemplateSerializer, SiteSerializer, SignupSerializer

class SiteCategoryListView(generics.ListAPIView):
    queryset = SiteCategory.objects.filter(is_active=True)
    serializer_class = SiteCategorySerializer
    permission_classes = [permissions.AllowAny]

class TemplateListView(generics.ListAPIView):
    serializer_class = TemplateSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Template.objects.filter(is_active=True)
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

class TemplateDetailView(generics.RetrieveAPIView):
    queryset = Template.objects.filter(is_active=True)
    serializer_class = TemplateSerializer
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
            
        # Get template default settings
        template = validated_data.get('template')
        default_settings = {}
        if template:
            default_settings = template.default_settings

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
        
        # 1. Handle Template Update
        template_id = request.data.get('template_id')
        if template_id:
            try:
                new_template = Template.objects.get(id=template_id, is_active=True)
                # Check if template is in the same category
                if new_template.category_id != instance.category_id:
                    return Response(
                        {"detail": "You can only switch templates within your current category."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                instance.template = new_template
                # Merge new template default settings with existing settings
                if isinstance(new_template.default_settings, dict) and isinstance(instance.settings, dict):
                    merged_settings = new_template.default_settings.copy()
                    merged_settings.update(instance.settings)
                    instance.settings = merged_settings
                else:
                    instance.settings = new_template.default_settings
            except Template.DoesNotExist:
                return Response({"detail": "Template not found or inactive."}, status=status.HTTP_400_BAD_REQUEST)

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

