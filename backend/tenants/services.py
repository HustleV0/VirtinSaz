from django.db import transaction
from django.utils.text import slugify
from django.conf import settings
from django.db.utils import OperationalError, ProgrammingError

from .models import Tenant
from .resolver import invalidate_host_cache


def _normalize_subdomain(value: str, fallback: str) -> str:
    normalized = slugify(value or "", allow_unicode=False)
    if not normalized:
        normalized = slugify(fallback, allow_unicode=False) or "tenant"
    return normalized


@transaction.atomic
def ensure_tenant_for_site(site, *, plan=Tenant.Plan.FREE, status=Tenant.Status.ACTIVE):
    """
    Guarantees one Tenant row exists for a Site and keeps owner.tenant in sync.
    """
    requested_subdomain = _normalize_subdomain(
        site.subdomain or site.slug,
        f"site-{site.id}",
    )

    base_subdomain = requested_subdomain
    subdomain = base_subdomain
    suffix = 2

    while Tenant.objects.exclude(site=site).filter(subdomain=subdomain).exists():
        subdomain = f"{base_subdomain}-{suffix}"
        suffix += 1

    defaults = {
        "name": site.name,
        "subdomain": subdomain,
        "plan": plan,
        "status": status,
    }
    tenant, _ = Tenant.objects.update_or_create(site=site, defaults=defaults)

    owner = site.owner
    if owner and getattr(owner, "tenant_id", None) != tenant.id:
        try:
            owner.tenant = tenant
            owner.save(update_fields=["tenant"])
        except (OperationalError, ProgrammingError):
            pass

    platform_domain = getattr(settings, "PLATFORM_DOMAIN", "vofino.ir")
    invalidate_host_cache(f"{subdomain}.{platform_domain}")
    if tenant.custom_domain:
        invalidate_host_cache(tenant.custom_domain)

    return tenant
