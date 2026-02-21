from django.db import models

from .context import get_current_tenant


class TenantScopedQuerySet(models.QuerySet):
    def for_tenant(self, tenant):
        tenant_id = getattr(tenant, "id", tenant)
        if tenant_id is None:
            return self.none()
        return self.filter(tenant_id=tenant_id)


class TenantScopedManager(models.Manager.from_queryset(TenantScopedQuerySet)):
    """
    When a tenant context exists (set by middleware), all reads are auto-scoped.
    """

    def get_queryset(self):
        queryset = super().get_queryset()
        tenant = get_current_tenant()
        if tenant is None:
            return queryset
        return queryset.for_tenant(tenant)

    def for_tenant(self, tenant):
        return super().get_queryset().for_tenant(tenant)
