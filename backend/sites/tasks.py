from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Site

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
