import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Feature(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.SlugField(unique=True, max_length=100, verbose_name=_("Feature Code"))
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    description = models.TextField(blank=True, verbose_name=_("Description"))
    requires_payment = models.BooleanField(default=True, verbose_name=_("Requires Payment"))
    group = models.CharField(max_length=100, blank=True, verbose_name=_("Group"))

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Feature")
        verbose_name_plural = _("Features")

    def __str__(self):
        return self.name

class Plan(models.Model):
    BILLING_CYCLE_CHOICES = (
        ('monthly', _('Monthly')),
        ('yearly', _('Yearly')),
        ('lifetime', _('Lifetime')),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    description = models.TextField(blank=True, verbose_name=_("Description"))
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLE_CHOICES, default='monthly')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name=_("Price"))
    currency = models.CharField(max_length=10, default='USD', verbose_name=_("Currency"))
    
    features_list = models.JSONField(default=list, blank=True, verbose_name=_("Features List"))
    limits = models.JSONField(default=dict, blank=True, verbose_name=_("Limits"))
    
    zarinpal_plan_id = models.CharField(max_length=255, blank=True, null=True)
    
    is_default = models.BooleanField(default=False, verbose_name=_("Is Default"))
    is_active = models.BooleanField(default=True, verbose_name=_("Is Active"))
    
    grace_period_days = models.PositiveIntegerField(default=7, verbose_name=_("Grace Period Days"))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Plan")
        verbose_name_plural = _("Plans")

    def __str__(self):
        return f"{self.name} ({self.get_billing_cycle_display()})"

class Subscription(models.Model):
    STATUS_CHOICES = (
        ('trial', _('Trial')),
        ('active', _('Active')),
        ('past_due', _('Past Due')),
        ('canceled', _('Canceled')),
        ('expired', _('Expired')),
        ('suspended', _('Suspended')),
    )
    
    PAYMENT_PROVIDER_CHOICES = (
        ('zarinpal', 'ZarinPal'),
        ('manual', 'Manual'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name='subscriptions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    start_date = models.DateTimeField(verbose_name=_("Start Date"))
    end_date = models.DateTimeField(null=True, blank=True, verbose_name=_("End Date"))
    
    billing_start = models.DateTimeField(verbose_name=_("Billing Start"))
    billing_end = models.DateTimeField(null=True, blank=True, verbose_name=_("Billing End"))
    
    cancel_at = models.DateTimeField(null=True, blank=True, verbose_name=_("Cancel At"))
    
    payment_provider = models.CharField(max_length=20, choices=PAYMENT_PROVIDER_CHOICES, blank=True)
    payment_reference = models.CharField(max_length=255, blank=True, verbose_name=_("Payment Reference"))
    
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Subscription")
        verbose_name_plural = _("Subscriptions")

    def __str__(self):
        return f"{self.user.email} - {self.plan.name}"

class SubscriptionHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='history')
    old_plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, related_name='history_old')
    new_plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, related_name='history_new')
    
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    reason = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Subscription History")
        verbose_name_plural = _("Subscription Histories")
        ordering = ['-created_at']

class Invoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, related_name='invoices')
    
    number = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    
    status = models.CharField(max_length=20, choices=(('paid', 'Paid'), ('unpaid', 'Unpaid'), ('void', 'Void')), default='unpaid')
    
    pdf = models.FileField(upload_to='invoices/', null=True, blank=True)
    
    payment_provider = models.CharField(max_length=20, blank=True)
    payment_reference = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("Invoice")
        verbose_name_plural = _("Invoices")

class WebhookEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.CharField(max_length=50)
    event_type = models.CharField(max_length=100)
    payload = models.JSONField()
    
    status = models.CharField(max_length=20, choices=(('pending', 'Pending'), ('processed', 'Processed'), ('failed', 'Failed')), default='pending')
    error_log = models.TextField(blank=True)
    
    retry_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("Webhook Event")
        verbose_name_plural = _("Webhook Events")
