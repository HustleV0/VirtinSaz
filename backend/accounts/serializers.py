from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from sites.models import Site, SiteCategory, Theme
from django.db import transaction

class UserSerializer(serializers.ModelSerializer):
    has_site = serializers.SerializerMethodField()
    site_slug = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'phone_number', 'email', 'full_name', 'restaurant_name', 'is_verified', 'avatar', 'has_site', 'site_slug']

    def get_has_site(self, obj):
        return obj.sites.exists()

    def get_site_slug(self, obj):
        first_site = obj.sites.first()
        return first_site.slug if first_site else None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    tokens = serializers.SerializerMethodField()
    site_slug = serializers.CharField(required=False, allow_blank=True)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    theme_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['username', 'phone_number', 'email', 'full_name', 'restaurant_name', 'password', 'tokens', 'site_slug', 'category_id', 'theme_id']

    def get_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @transaction.atomic
    def create(self, validated_data):
        site_slug = validated_data.pop('site_slug', None)
        category_id = validated_data.pop('category_id', None)
        theme_id = validated_data.pop('theme_id', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number'),
            email=validated_data.get('email'),
            full_name=validated_data.get('full_name'),
            restaurant_name=validated_data.get('restaurant_name'),
            is_verified=True
        )
        
        # Create site if requested
        if site_slug or category_id or theme_id:
            try:
                category = None
                if category_id:
                    category = SiteCategory.objects.filter(id=category_id).first()
                if not category:
                    category, _ = SiteCategory.objects.get_or_create(slug='general', defaults={'name': 'General'})
                
                theme = None
                if theme_id:
                    theme = Theme.objects.filter(id=theme_id).first()
                if not theme:
                    theme = Theme.objects.filter(category=category).first() or Theme.objects.first()
                
                Site.objects.create(
                    owner=user,
                    name=user.restaurant_name or f"Site for {user.username}",
                    slug=site_slug or f"site-{user.username}",
                    category=category,
                    theme=theme,
                    settings=theme.default_settings if theme else {}
                )
            except Exception:
                # If site creation fails, we still have the user
                pass
                
        return user
