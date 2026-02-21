from django.conf import settings
from django.core.cache import cache

from .models import Tenant


NEGATIVE_CACHE_VALUE = "missing"
CONTROL_PLANE_CACHE_VALUE = "control"


def _cache_key(host: str) -> str:
    return f"tenant:host:{host}"


def normalize_host(host: str) -> str:
    if not host:
        return ""
    return host.split(":")[0].strip().lower().rstrip(".")


def get_control_plane_hosts():
    return {h.lower() for h in getattr(settings, "TENANT_CONTROL_PLANE_HOSTS", [])}


def get_reserved_subdomains():
    return {s.lower() for s in getattr(settings, "TENANT_RESERVED_SUBDOMAINS", [])}


def extract_subdomain(host: str):
    platform_domain = getattr(settings, "PLATFORM_DOMAIN", "vofino.ir").lower()
    if host == platform_domain:
        return None
    suffix = f".{platform_domain}"
    if not host.endswith(suffix):
        return None
    left = host[: -len(suffix)]
    if not left or "." in left:
        return None
    if left in get_reserved_subdomains():
        return None
    return left


def invalidate_host_cache(host: str):
    host = normalize_host(host)
    if not host:
        return
    try:
        cache.delete(_cache_key(host))
    except Exception:
        # Do not fail requests if cache backend is unavailable.
        pass


def _cache_set(host: str, value):
    try:
        cache.set(_cache_key(host), value, timeout=getattr(settings, "TENANT_CACHE_TTL", 300))
    except Exception:
        pass


def _cache_get(host: str):
    try:
        return cache.get(_cache_key(host))
    except Exception:
        return None


def resolve_tenant_from_host(raw_host: str):
    """
    Returns:
        (tenant, is_control_plane_host)
    """
    host = normalize_host(raw_host)
    if not host:
        return None, True

    cached = _cache_get(host)
    if cached == CONTROL_PLANE_CACHE_VALUE:
        return None, True
    if cached == NEGATIVE_CACHE_VALUE:
        return None, False
    if cached:
        tenant = Tenant.objects.select_related("site").filter(id=cached).first()
        if tenant:
            return tenant, False

    if host in get_control_plane_hosts():
        _cache_set(host, CONTROL_PLANE_CACHE_VALUE)
        return None, True

    tenant = Tenant.objects.select_related("site").filter(custom_domain__iexact=host).first()
    if tenant:
        _cache_set(host, tenant.id)
        return tenant, False

    subdomain = extract_subdomain(host)
    if not subdomain:
        _cache_set(host, NEGATIVE_CACHE_VALUE)
        return None, False

    tenant = Tenant.objects.select_related("site").filter(subdomain=subdomain).first()
    if tenant:
        _cache_set(host, tenant.id)
        return tenant, False

    _cache_set(host, NEGATIVE_CACHE_VALUE)
    return None, False
