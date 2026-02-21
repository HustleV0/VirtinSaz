from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from django.db.utils import OperationalError, ProgrammingError

from sites.models import Site

from .models import Tenant
from .resolver import invalidate_host_cache
from .services import ensure_tenant_for_site


@receiver(pre_save, sender=Tenant)
def tenant_capture_old_domains(sender, instance, **kwargs):
    if not instance.pk:
        instance._old_subdomain = None
        instance._old_custom_domain = None
        return
    previous = Tenant.objects.filter(pk=instance.pk).values("subdomain", "custom_domain").first()
    instance._old_subdomain = previous["subdomain"] if previous else None
    instance._old_custom_domain = previous["custom_domain"] if previous else None


@receiver(post_save, sender=Tenant)
def tenant_clear_cache_on_save(sender, instance, **kwargs):
    platform_domain = getattr(settings, "PLATFORM_DOMAIN", "vofino.ir")
    invalidate_host_cache(f"{instance.subdomain}.{platform_domain}")
    if instance.custom_domain:
        invalidate_host_cache(instance.custom_domain)
    if getattr(instance, "_old_subdomain", None):
        invalidate_host_cache(f"{instance._old_subdomain}.{platform_domain}")
    if getattr(instance, "_old_custom_domain", None):
        invalidate_host_cache(instance._old_custom_domain)


@receiver(post_delete, sender=Tenant)
def tenant_clear_cache_on_delete(sender, instance, **kwargs):
    platform_domain = getattr(settings, "PLATFORM_DOMAIN", "vofino.ir")
    invalidate_host_cache(f"{instance.subdomain}.{platform_domain}")
    if instance.custom_domain:
        invalidate_host_cache(instance.custom_domain)


@receiver(post_save, sender=Site)
def sync_tenant_from_site(sender, instance, created, raw, **kwargs):
    if raw:
        return
    if not (instance.subdomain or instance.slug):
        return
    try:
        ensure_tenant_for_site(instance)
    except (OperationalError, ProgrammingError):
        # Can happen during migration bootstrap before tenants table exists.
        return
