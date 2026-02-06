from django.contrib import admin
from .models import SiteCategory, Template, Site

@admin.register(SiteCategory)
class SiteCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('is_active', 'category')
    search_fields = ('name', 'source_identifier')

@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'category', 'template', 'created_at')
    list_filter = ('category', 'template')
    search_fields = ('name', 'owner__phone_number')
    readonly_fields = ('created_at',)
