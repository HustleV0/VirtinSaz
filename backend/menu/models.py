from django.db import models
from sites.models import Site

class ProductTag(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='product_tags')
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=20, null=True, blank=True, help_text="Hex color code")

    def __str__(self):
        return f"{self.name} ({self.site.name})"

    class Meta:
        unique_together = ('site', 'name')

class ProductCategory(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='product_categories')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, allow_unicode=True, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.site.name})"

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Product Categories"
        unique_together = ('site', 'slug')

class Product(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, allow_unicode=True, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    price = models.BigIntegerField() # Price in IRR/Toman as integer
    discount_percentage = models.PositiveIntegerField(default=0)
    badge = models.CharField(max_length=50, null=True, blank=True, help_text="e.g. New, Special")
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    tags = models.ManyToManyField(ProductTag, blank=True, related_name='products')
    order = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.site.name})"

    class Meta:
        ordering = ['order']
        unique_together = ('site', 'slug')
