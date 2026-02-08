from celery import shared_task
from django.utils import timezone
from .models import Subscription, WebhookEvent
from .services import SubscriptionService
from datetime import timedelta

@shared_task(bind=True, max_retries=5)
def process_webhook_event(self, event_id):
    """
    Asynchronously process a webhook event with retry logic.
    """
    try:
        event = WebhookEvent.objects.get(id=event_id)
        # Logic to process the event based on provider and event_type
        # Example: if event.event_type == 'payment.success': ...
        
        event.status = 'processed'
        event.processed_at = timezone.now()
        event.save()
    except Exception as exc:
        event = WebhookEvent.objects.get(id=event_id)
        event.retry_count += 1
        event.error_log = str(exc)
        event.status = 'failed'
        event.save()
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

@shared_task
def daily_check_expirations():
    """
    Mark subscriptions as expired if they have passed their end date.
    """
    count = SubscriptionService.handle_expiry()
    return f"Marked {count} subscriptions as expired."

@shared_task
def send_reminder_notifications(days_before=7):
    """
    Find subscriptions ending soon and send reminders.
    """
    reminder_date = timezone.now() + timedelta(days=days_before)
    target_subs = Subscription.objects.filter(
        status='active',
        end_date__date=reminder_date.date()
    )
    
    for sub in target_subs:
        # TODO: Integrate with notification system
        # send_notification(sub.user, f"Your subscription for {sub.plan.name} expires in {days_before} days.")
        pass
        
    return f"Sent {target_subs.count()} reminder notifications."

@shared_task
def sync_from_stripe():
    """
    Sync subscription statuses from Stripe (e.g. for failed payments).
    """
    # This would involve iterating over active stripe subscriptions
    # and checking their status via stripe.Subscription.retrieve()
    pass
