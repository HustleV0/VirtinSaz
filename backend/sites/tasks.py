import time
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Site

@shared_task
def provision_site_task(site_id):
    try:
        site = Site.objects.get(id=site_id)
    except Site.DoesNotExist:
        return f"Site {site_id} not found."

    # Stage 1: Optimizing Products
    site.provisioning_status = 'optimizing_products'
    site.save()

    # Stage 2: Preparing Settings
    site.provisioning_status = 'preparing_settings'
    site.save()

    # Stage 3: Setting Subdomain (Wildcard DNS handles this automatically)
    site.provisioning_status = 'setting_subdomain'
    site.save()

    # Stage 4: Receiving SSL (Handled on-demand by Caddy)
    site.provisioning_status = 'receiving_ssl'
    site.save()

    # Stage 5: Ready
    site.provisioning_status = 'ready'
    site.save()

    return f"Site {site.subdomain} is ready."

@shared_task
def delete_expired_sites():
    now = timezone.now()
    # Delete sites where trial_ends_at + 2 days < now AND no active subscription
    expired_sites = Site.objects.filter(
        trial_ends_at__lt=now - timedelta(days=2),
        subscription_ends_at__isnull=True
    ) | Site.objects.filter(
        trial_ends_at__lt=now - timedelta(days=2),
        subscription_ends_at__lt=now - timedelta(days=2) # Grace period for paid subscription too
    )
    
    count = expired_sites.count()
    # Perform deletion
    for site in expired_sites:
        site.delete()
        
    return f"Deleted {count} expired sites."
