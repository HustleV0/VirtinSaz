from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User
from sites.models import Site

class SiteInline(admin.TabularInline):
    model = Site
    extra = 0
    fields = ('name', 'slug', 'category', 'theme', 'view_site_link')
    readonly_fields = ('view_site_link',)

    def view_site_link(self, obj):
        if obj.slug:
            url = f"/{obj.slug}/"
            return format_html('<a href="{}" target="_blank">مشاهده</a>', url)
        return "-"
    view_site_link.short_description = "لینک"

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'phone_number', 'full_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_verified')
    fieldsets = (
        (None, {'fields': ('username', 'phone_number', 'password')}),
        ('Personal info', {'fields': ('full_name', 'email', 'avatar', 'restaurant_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password'),
        }),
    )
    search_fields = ('username', 'phone_number', 'full_name', 'email')
    readonly_fields = ('date_joined', 'last_login')
    ordering = ('username',)
    inlines = [SiteInline]
