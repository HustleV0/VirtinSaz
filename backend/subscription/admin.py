from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Plan, Subscription, Feature, SubscriptionHistory
from .services import SubscriptionService

class SubscriptionHistoryInline(admin.TabularInline):
    model = SubscriptionHistory
    extra = 0
    readonly_fields = ('old_plan', 'new_plan', 'changed_by', 'reason', 'created_at')
    can_delete = False

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'requires_payment', 'group')
    search_fields = ('name', 'code')
    list_filter = ('requires_payment', 'group')

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'billing_cycle', 'price', 'currency', 'is_default', 'is_active')
    list_filter = ('billing_cycle', 'is_default', 'is_active')
    search_fields = ('name',)
    
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'is_active', 'is_default')
        }),
        (_('Pricing'), {
            'fields': ('billing_cycle', 'price', 'currency')
        }),
        (_('Features & Limits'), {
            'fields': ('features_list', 'limits')
        }),
        (_('External IDs'), {
            'fields': ('zarinpal_plan_id',),
            'classes': ('collapse',)
        }),
    )

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'start_date', 'end_date', 'payment_provider')
    list_filter = ('status', 'payment_provider', 'plan')
    search_fields = ('user__email', 'payment_reference')
    inlines = [SubscriptionHistoryInline]
    actions = ['mark_as_expired', 'assign_free_plan']

    @admin.action(description=_("Mark selected subscriptions as expired"))
    def mark_as_expired(self, request, queryset):
        queryset.update(status='expired')

    @admin.action(description=_("Assign free plan to selected users"))
    def assign_free_plan(self, request, queryset):
        free_plan = Plan.objects.filter(price=0, is_active=True).first()
        if not free_plan:
            self.message_user(request, _("No free plan found."), level='error')
            return
        
        for sub in queryset:
            SubscriptionService.upgrade_plan(sub.user, free_plan, changed_by=request.user)
        self.message_user(request, _("Free plan assigned to selected users."))

@admin.register(SubscriptionHistory)
class SubscriptionHistoryAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'old_plan', 'new_plan', 'changed_by', 'created_at')
    list_filter = ('created_at', 'new_plan')
    search_fields = ('subscription__user__phone_number', 'subscription__user__email')
    readonly_fields = ('created_at',)
    
    def has_add_permission(self, request):
        # جلوگیری از اضافه کردن دستی تاریخچه بدون منطق بیزنس
        return False
