from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Payment
from menu.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_price = serializers.IntegerField(source='product.price', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_title', 'product_price', 'quantity', 'price_snapshot', 'product_name_snapshot', 'total_price']
        read_only_fields = ['price_snapshot', 'product_name_snapshot']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'site', 'user', 'session_key', 'items', 'total_amount', 'created_at', 'updated_at']

    def get_total_amount(self, obj):
        return sum(item.total_price for item in obj.items.all())

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price_snapshot', 'product_name_snapshot']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'status', 'provider', 'transaction_id', 'amount', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'site', 'user', 'status', 'total_amount', 'first_name', 'last_name', 'phone_number', 'address', 'items', 'payment', 'created_at']
        read_only_fields = ['status', 'total_amount', 'site', 'user']
