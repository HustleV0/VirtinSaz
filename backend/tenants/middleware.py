from django.http import JsonResponse

from .context import reset_current_tenant, set_current_tenant
from .models import Tenant
from .resolver import resolve_tenant_from_host


class TenantResolverMiddleware:
    """
    Resolves tenant only from request host and stores it in request context.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host()
        tenant, is_control_plane = resolve_tenant_from_host(host)

        token = set_current_tenant(tenant)
        request.tenant = tenant
        request.site = tenant.site if tenant and tenant.site_id else None

        try:
            if tenant is None and not is_control_plane:
                return JsonResponse({"detail": "Tenant not found."}, status=404)

            if tenant and tenant.status == Tenant.Status.SUSPENDED:
                return JsonResponse({"detail": "Tenant is suspended."}, status=403)

            if tenant and tenant.status == Tenant.Status.DISABLED:
                return JsonResponse({"detail": "Tenant is disabled."}, status=403)

            return self.get_response(request)
        finally:
            reset_current_tenant(token)
