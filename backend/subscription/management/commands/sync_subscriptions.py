from django.core.management.base import BaseCommand
from subscription.models import Subscription
from subscription.services import SubscriptionService

class Command(BaseCommand):
    help = 'Sync and check all subscriptions for expiration'

    def handle(self, *args, **options):
        self.stdout.write('Checking for expired subscriptions...')
        count = SubscriptionService.handle_expiry()
        self.stdout.write(self.style.SUCCESS(f'Successfully marked {count} subscriptions as expired.'))
