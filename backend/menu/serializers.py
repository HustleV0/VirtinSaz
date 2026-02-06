from rest_framework import serializers
from .models import ProductTag, ProductCategory, Product
from sites.models import Site

class ProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTag
        fields = ['id', 'name', 'color']

    def create(self, validated_data):
        # Site is injected by the view
        return super().create(validated_data)

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'slug', 'description', 'order', 'is_active']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = ProductTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=ProductTag.objects.all(), 
        source='tags', 
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'title', 'slug', 'description', 
            'price', 'discount_percentage', 'badge', 'image', 'tags', 'tag_ids',
            'order', 'is_available', 'is_popular', 'created_at'
        ]

    def validate_tag_ids(self, value):
        # Ensure tags belong to the user's site
        user = self.context['request'].user
        site = Site.get_or_create_for_user(user)
        if not site:
            raise serializers.ValidationError("User has no associated site.")
        for tag in value:
            if tag.site_id != site.id:
                raise serializers.ValidationError(f"Tag {tag.id} does not belong to your site.")
        return value
