from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import SiteCategory, Theme, Site, Plugin, SitePlugin
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class PluginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plugin
        fields = ['key', 'name', 'description', 'is_core', 'is_usable']

class SitePluginSerializer(serializers.ModelSerializer):
    plugin_key = serializers.CharField(source='plugin.key', read_only=True)
    plugin_name = serializers.CharField(source='plugin.name', read_only=True)

    class Meta:
        model = SitePlugin
        fields = ['plugin_key', 'plugin_name', 'is_active']

class SiteCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteCategory
        fields = ['id', 'name', 'slug', 'is_active', 'created_at']

class ThemeSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    required_plugins = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='key'
    )

    class Meta:
        model = Theme
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 
            'site_types', 'preview_image', 'preview_url', 'tag', 
            'description', 'source_identifier', 'config', 
            'default_settings', 'required_plugins', 'is_active', 'created_at'
        ]

class SiteSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    theme_name = serializers.CharField(source='theme.name', read_only=True)
    theme = serializers.PrimaryKeyRelatedField(queryset=Theme.objects.all(), required=False, allow_null=True)
    category = serializers.PrimaryKeyRelatedField(queryset=SiteCategory.objects.all())
    source_identifier = serializers.SerializerMethodField()
    owner_phone = serializers.CharField(source='owner.phone_number', read_only=True)
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    active_plugins = serializers.SerializerMethodField()
    required_plugins = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    subscription_days_left = serializers.SerializerMethodField()
    is_trial = serializers.SerializerMethodField()

    class Meta:
        model = Site
        fields = [
            'id', 'name', 'slug', 'logo', 'cover_image', 
            'category', 'category_name', 'theme', 'theme_name', 
            'source_identifier', 'owner_phone', 'owner_id', 
            'settings', 'active_plugins', 'required_plugins', 
            'product_count', 'subscription_days_left', 'is_trial',
            'trial_ends_at', 'subscription_ends_at', 'created_at', 'updated_at',
            'meta_title', 'meta_description', 'schema_type'
        ]
        read_only_fields = ['owner']

    def get_source_identifier(self, obj):
        if obj.theme:
            return obj.theme.source_identifier
        # Fallback to a default if theme is missing
        return "minimal-cafe"

    def get_active_plugins(self, obj):
        return obj.get_active_plugins()
    
    def get_required_plugins(self, obj):
        if obj.theme:
            return [p.key for p in obj.theme.required_plugins.all()]
        return []

    def get_product_count(self, obj):
        return obj.products.count()

    def get_subscription_days_left(self, obj):
        from django.utils import timezone
        now = timezone.now()
        
        # Priority: Paid subscription, then Trial
        if obj.subscription_ends_at and obj.subscription_ends_at > now:
            delta = obj.subscription_ends_at - now
            return delta.days
        
        if obj.trial_ends_at and obj.trial_ends_at > now:
            delta = obj.trial_ends_at - now
            return delta.days
            
        return 0

    def get_is_trial(self, obj):
        from django.utils import timezone
        now = timezone.now()
        if obj.subscription_ends_at and obj.subscription_ends_at > now:
            return False
        return True

class SignupSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True)
    site_name = serializers.CharField(max_length=255)
    category_id = serializers.IntegerField()
    theme_id = serializers.IntegerField()
    
    tokens = serializers.SerializerMethodField()

    def validate(self, attrs):
        category = SiteCategory.objects.filter(id=attrs['category_id'], is_active=True).first()
        if not category:
            raise serializers.ValidationError({"category_id": "Category not found or inactive."})
        
        theme = Theme.objects.filter(id=attrs['theme_id'], is_active=True).first()
        if not theme:
            raise serializers.ValidationError({"theme_id": "Theme not found or inactive."})
        
        # Check if theme supports this category
        if theme.category_id != category.id and category.slug not in (theme.site_types or []):
            raise serializers.ValidationError({"theme_id": "Theme does not support the selected category."})
        
        attrs['category'] = category
        attrs['theme'] = theme
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            is_verified=True # Assuming phone verification happened before this
        )
        
        from django.utils.text import slugify
        from .services import ThemeService
        site = Site.objects.create(
            owner=user,
            name=validated_data['site_name'],
            slug=slugify(validated_data['site_name'], allow_unicode=True),
            category=validated_data['category'],
            theme=validated_data['theme'],
            settings=validated_data['theme'].default_settings
        )
        
        # Activate theme plugins
        ThemeService.activate_theme(site, validated_data['theme'])
        
        self.user = user
        return site

    def get_tokens(self, obj):
        user = self.user
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
