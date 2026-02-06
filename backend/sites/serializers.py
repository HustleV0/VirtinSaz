from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import SiteCategory, Template, Site
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class SiteCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteCategory
        fields = ['id', 'name', 'slug', 'is_active', 'created_at']

class TemplateSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Template
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 
            'preview_image', 'tag', 'description', 
            'source_identifier', 'is_active', 'created_at'
        ]

class SiteSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    source_identifier = serializers.CharField(source='template.source_identifier', read_only=True)
    owner_phone = serializers.CharField(source='owner.phone_number', read_only=True)
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)

    class Meta:
        model = Site
        fields = ['id', 'name', 'slug', 'logo', 'cover_image', 'category', 'category_name', 'template', 'template_name', 'source_identifier', 'owner_phone', 'owner_id', 'settings', 'created_at']
        read_only_fields = ['owner']

class SignupSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True)
    site_name = serializers.CharField(max_length=255)
    category_id = serializers.IntegerField()
    template_id = serializers.IntegerField()
    
    tokens = serializers.SerializerMethodField()

    def validate(self, attrs):
        category = SiteCategory.objects.filter(id=attrs['category_id'], is_active=True).first()
        if not category:
            raise serializers.ValidationError({"category_id": "Category not found or inactive."})
        
        template = Template.objects.filter(id=attrs['template_id'], is_active=True).first()
        if not template:
            raise serializers.ValidationError({"template_id": "Template not found or inactive."})
        
        if template.category_id != category.id:
            raise serializers.ValidationError({"template_id": "Template does not belong to the selected category."})
        
        attrs['category'] = category
        attrs['template'] = template
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            is_verified=True # Assuming phone verification happened before this
        )
        
        from django.utils.text import slugify
        site = Site.objects.create(
            owner=user,
            name=validated_data['site_name'],
            slug=slugify(validated_data['site_name'], allow_unicode=True),
            category=validated_data['category'],
            template=validated_data['template'],
            settings=validated_data['template'].default_settings
        )
        
        self.user = user
        return site

    def get_tokens(self, obj):
        user = self.user
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
