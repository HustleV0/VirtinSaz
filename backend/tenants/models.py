from django.db import models

from .managers import TenantScopedManager


class Tenant(models.Model):
    class Plan(models.TextChoices):
        FREE = "free", "Free"
        PRO = "pro", "Pro"
        ENTERPRISE = "enterprise", "Enterprise"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        SUSPENDED = "suspended", "Suspended"
        DISABLED = "disabled", "Disabled"

    name = models.CharField(max_length=255)
    subdomain = models.SlugField(max_length=100, unique=True, db_index=True)
    custom_domain = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        unique=True,
        db_index=True,
    )
    plan = models.CharField(max_length=20, choices=Plan.choices, default=Plan.FREE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    site = models.OneToOneField(
        "sites.Site",
        on_delete=models.CASCADE,
        related_name="tenant",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenants"
        indexes = [
            models.Index(fields=["status"], name="tenants_status_idx"),
        ]

    def __str__(self):
        return f"{self.name} ({self.subdomain})"


class TenantOwnedModel(models.Model):
    """
    Base model for tenant-owned rows.
    Adds tenant_id and centralizes tenant-aware manager behavior.
    """

    tenant = models.ForeignKey(
        "tenants.Tenant",
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_rows",
        db_index=True,
    )

    objects = TenantScopedManager()
    unscoped = models.Manager()

    class Meta:
        abstract = True
