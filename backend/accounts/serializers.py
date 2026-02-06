from rest_framework import serializers
from .models import User, OTP
from rest_framework_simplejwt.tokens import RefreshToken
from sites.models import Site, SiteCategory, Template
from django.db import transaction

class UserSerializer(serializers.ModelSerializer):
    has_site = serializers.SerializerMethodField()
    site_slug = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'email', 'full_name', 'restaurant_name', 'is_verified', 'avatar', 'has_site', 'site_slug']

    def get_has_site(self, obj):
        return obj.sites.exists()

    def get_site_slug(self, obj):
        first_site = obj.sites.first()
        return first_site.slug if first_site else None

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['phone_number', 'code']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    tokens = serializers.SerializerMethodField()
    site_slug = serializers.CharField(required=False, allow_blank=True)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    template_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['phone_number', 'email', 'full_name', 'restaurant_name', 'password', 'tokens', 'site_slug', 'category_id', 'template_id']

    def get_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            email=validated_data.get('email'),
            full_name=validated_data.get('full_name'),
            restaurant_name=validated_data.get('restaurant_name'),
            is_verified=True
        )
        return user
