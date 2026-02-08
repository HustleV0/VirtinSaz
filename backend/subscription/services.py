from django.utils import timezone
from django.db import transaction
from .models import Plan, Subscription, SubscriptionHistory, Feature, Invoice
from datetime import timedelta
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.core.files.base import ContentFile
import uuid
import decimal

class SubscriptionService:
    @staticmethod
    def calculate_proration(current_subscription, new_plan):
        """
        Calculates the remaining value of the current subscription and applies it as credit.
        """
        now = timezone.now()
        if not current_subscription.end_date or current_subscription.end_date <= now:
            return new_plan.price

        total_duration = current_subscription.end_date - current_subscription.start_date
        remaining_duration = current_subscription.end_date - now
        
        remaining_ratio = decimal.Decimal(remaining_duration.total_seconds() / total_duration.total_seconds())
        unused_value = current_subscription.plan.price * remaining_ratio
        
        amount_to_pay = max(0, new_plan.price - unused_value)
        return amount_to_pay

    @staticmethod
    def create_subscription(user, plan, payment_provider='manual', payment_reference=''):
        with transaction.atomic():
            now = timezone.now()
            duration = None
            if plan.billing_cycle == 'monthly':
                duration = timedelta(days=30)
            elif plan.billing_cycle == 'yearly':
                duration = timedelta(days=365)

            end_date = now + duration if duration else None

            subscription, created = Subscription.objects.update_or_create(
                user=user,
                defaults={
                    'plan': plan,
                    'status': 'active',
                    'start_date': now,
                    'end_date': end_date,
                    'billing_start': now,
                    'billing_end': end_date,
                    'payment_provider': payment_provider,
                    'payment_reference': payment_reference,
                }
            )
            
            # Create Invoice
            Invoice.objects.create(
                user=user,
                subscription=subscription,
                number=f"INV-{uuid.uuid4().hex[:8].upper()}",
                amount=plan.price,
                currency=plan.currency,
                status='paid',
                payment_provider=payment_provider,
                payment_reference=payment_reference,
                paid_at=now
            )

            SubscriptionHistory.objects.create(
                subscription=subscription,
                new_plan=plan,
                reason="Initial creation or manual update"
            )
            return subscription

    @staticmethod
    def handle_expiry():
        """
        Optimized expiry handler with Grace Period (Past Due) support.
        """
        now = timezone.now()
        
        # 1. Active -> Past Due (Grace Period)
        to_past_due = Subscription.objects.filter(
            status='active',
            end_date__lt=now
        ).exclude(end_date__isnull=True)
        
        for sub in to_past_due:
            grace_end = sub.end_date + timedelta(days=sub.plan.grace_period_days)
            if now < grace_end:
                sub.status = 'past_due'
                sub.save()
            else:
                sub.status = 'expired'
                sub.save()

        # 2. Past Due -> Expired
        to_expired = Subscription.objects.filter(
            status='past_due'
        )
        for sub in to_expired:
            grace_end = sub.end_date + timedelta(days=sub.plan.grace_period_days)
            if now >= grace_end:
                sub.status = 'expired'
                sub.save()
                
        return to_past_due.count() + to_expired.count()
        
    @staticmethod
    def generate_invoice_pdf(invoice_id):
        """
        Generates PDF for an invoice using WeasyPrint.
        """
        from weasyprint import HTML
        invoice = Invoice.objects.get(id=invoice_id)
        
        html_string = render_to_string('subscription/invoice_pdf.html', {'invoice': invoice})
        pdf_file = HTML(string=html_string).write_pdf()
        
        invoice.pdf.save(f"invoice_{invoice.number}.pdf", ContentFile(pdf_file))
        return invoice
