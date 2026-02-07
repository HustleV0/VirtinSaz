from django.db import models
from django.conf import settings
from sites.models import Site
from menu.models import Product

class Cart(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='carts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='carts')
    session_key = models.CharField(max_length=40, null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['site', 'user']),
            models.Index(fields=['site', 'session_key']),
        ]

    def __str__(self):
        return f"Cart {self.id} - {self.site.name}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    # Snapshots for persistence if product price changes or product is deleted (though here it's still linked)
    price_snapshot = models.BigIntegerField()
    product_name_snapshot = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.price_snapshot:
            self.price_snapshot = self.product.price
        if not self.product_name_snapshot:
            self.product_name_snapshot = self.product.title
        super().save(*args, **kwargs)

    @property
    def total_price(self):
        return self.price_snapshot * self.quantity

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('canceled', 'Canceled'),
        ('delivered', 'Delivered'),
    )

    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='orders')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    total_amount = models.BigIntegerField()
    
    # Customer Info (Captured at checkout)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    address = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['site', 'status']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"Order {self.id} - {self.site.name} ({self.status})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    price_snapshot = models.BigIntegerField()
    product_name_snapshot = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product_name_snapshot} x {self.quantity}"

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    provider = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=255, null=True, blank=True, unique=True)
    amount = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment for Order {self.order.id} - {self.status}"
