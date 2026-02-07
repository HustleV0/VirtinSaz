from django.contrib import admin
from .models import Product, ProductCategory, ProductTag

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'site', 'order', 'is_active')
    list_filter = ('site', 'is_active')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(ProductTag)
class ProductTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'site', 'color')
    list_filter = ('site',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'site', 'category', 'price', 'is_available', 'order')
    list_filter = ('site', 'category', 'is_available')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    autocomplete_fields = ['category', 'site']
    filter_horizontal = ('tags',)
