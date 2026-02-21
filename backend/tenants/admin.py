from django.contrib import admin

from .models import Tenant


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "subdomain", "custom_domain", "plan", "status", "created_at")
    search_fields = ("name", "subdomain", "custom_domain")
    list_filter = ("plan", "status", "created_at")
