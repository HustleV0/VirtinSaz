from django.shortcuts import get_object_or_404
from .models import Site

class SubdomainMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(':')[0]
        domain_parts = host.split('.')

        # Assuming main domain is vofino.ir
        # Subdomain structure: <slug>.vofino.ir
        if len(domain_parts) > 2:
            subdomain = domain_parts[0]
            if subdomain not in ['www', 'admin', 'api']:
                try:
                    from django.db.models import Q
                    site = Site.objects.get(Q(subdomain=subdomain) | Q(slug=subdomain))
                    request.site = site
                except Site.DoesNotExist:
                    request.site = None
            else:
                request.site = None
        else:
            request.site = None

        response = self.get_response(request)
        return response
