from django.contrib import admin
from .models import SiteCategory, Theme, Site

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
    list_display = ('name', 'owner', 'category', 'theme', 'created_at')
    list_filter = ('category', 'theme')
    search_fields = ('name', 'owner__phone_number')
    readonly_fields = ('created_at',)
