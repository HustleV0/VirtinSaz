from rest_framework import serializers

from .models import Product, ProductCategory, ProductTag


class ProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTag
        fields = ['id', 'name', 'color']


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
        required=False,
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'category',
            'category_name',
            'title',
            'slug',
            'description',
            'price',
            'discount_percentage',
            'badge',
            'image',
            'tags',
            'tag_ids',
            'order',
            'is_available',
            'is_popular',
            'created_at',
        ]

    def validate_tag_ids(self, value):
        request = self.context['request']
        tenant = getattr(request, 'tenant', None)
        if not tenant and request.user.is_authenticated and request.user.tenant_id:
            tenant = request.user.tenant
        if not tenant:
            raise serializers.ValidationError('Tenant not found.')

        for tag in value:
            if tag.tenant_id != tenant.id:
                raise serializers.ValidationError(f'Tag {tag.id} does not belong to this tenant.')
        return value
