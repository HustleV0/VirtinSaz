from django.contrib import admin
from django.utils.html import format_html
from .models import SiteCategory, Theme, Site
from menu.models import Product

class ProductInline(admin.TabularInline):
    model = Product
    extra = 0
    fields = ('title', 'category', 'price', 'is_available')
    autocomplete_fields = ['category']

@admin.register(SiteCategory)
class SiteCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('is_active', 'category')
    search_fields = ('name', 'source_identifier')
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'category', 'site_types', 'tag', 'description', 'is_active')
        }),
        ('Assets', {
            'fields': ('preview_image', 'preview_url', 'source_identifier')
        }),
        ('Configuration', {
            'fields': ('config', 'default_settings'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'category', 'theme', 'view_site_link', 'created_at')
    list_filter = ('category', 'theme')
    search_fields = ('name', 'owner__phone_number')
    readonly_fields = ('created_at', 'view_site_link')
    inlines = [ProductInline]

    def view_site_link(self, obj):
        if obj.slug:
            url = f"/{obj.slug}/"
            return format_html('<a href="{}" target="_blank">مشاهده سایت</a>', url)
        return "-"
    view_site_link.short_description = "لینک سایت"
