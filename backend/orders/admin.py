from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, Payment

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'site', 'user', 'session_key', 'created_at')
    list_filter = ('site', 'created_at')
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('price_snapshot', 'product_name_snapshot')

class PaymentInline(admin.StackedInline):
    model = Payment
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'site', 'user', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'site', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone_number')
    inlines = [OrderItemInline, PaymentInline]
    readonly_fields = ('total_amount',)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        # Recalculate total amount after inlines (OrderItem) are saved
        form.instance.update_total_amount()

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'status', 'provider', 'amount', 'created_at')
    list_filter = ('status', 'provider')
    search_fields = ('transaction_id',)
