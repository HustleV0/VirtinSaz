from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Cart, CartItem, Order, OrderItem, Payment
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, PaymentSerializer
from sites.models import Site
from menu.models import Product

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        site = self.request.user.sites.first()
        if not site:
            return Payment.objects.none()
        return Payment.objects.filter(order__site=site).select_related('order').order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        total_sum = sum(p.amount for p in queryset if p.status == 'completed')
        return Response({
            'payments': serializer.data,
            'total_sum': total_sum
        })

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]

    def get_site(self):
        site_slug = self.request.query_params.get('site_slug')
        if not site_slug:
            site_slug = self.request.data.get('site_slug')
        return get_object_or_404(Site, slug=site_slug)

    def get_cart(self):
        site = self.get_site()
        user = self.request.user if self.request.user.is_authenticated else None
        
        if user:
            cart, _ = Cart.objects.get_or_create(site=site, user=user)
        else:
            if not self.request.session.session_key:
                self.request.session.create()
            session_key = self.request.session.session_key
            cart, _ = Cart.objects.get_or_create(site=site, session_key=session_key)
        return cart

    def list(self, request, *args, **kwargs):
        cart = self.get_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_cart()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id, site=cart.site)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product,
            defaults={
                'price_snapshot': product.price,
                'product_name_snapshot': product.title
            }
        )
        
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        cart = self.get_cart()
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity'))
        
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        if quantity <= 0:
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        cart_item.quantity = quantity
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = self.get_cart()
        item_id = request.data.get('item_id')
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        site_slug = self.request.query_params.get('site_slug')
        
        # If site owner, show all orders for their site
        # If regular user, show only their orders
        queryset = Order.objects.all().prefetch_related('items', 'payment')
        
        if site_slug:
            site = get_object_or_404(Site, slug=site_slug)
            if site.owner == user:
                return queryset.filter(site=site)
            return queryset.filter(site=site, user=user)
        
        return queryset.filter(user=user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        site_slug = request.data.get('site_slug')
        site = get_object_or_404(Site, slug=site_slug)
        
        # Get cart items either from server-side Cart or from request body
        user = request.user if request.user.is_authenticated else None
        items_data = request.data.get('items') # Optional: passed from frontend Zustand
        
        order_items = []
        total_amount = 0

        if items_data:
            # Create order from items passed in request (Zustand sync)
            for item in items_data:
                product = get_object_or_404(Product, id=item['id'], site=site)
                order_items.append({
                    'product': product,
                    'quantity': item['quantity'],
                    'price_snapshot': product.price,
                    'product_name_snapshot': product.title
                })
                total_amount += product.price * item['quantity']
        else:
            # Fallback to server-side Cart
            if user:
                cart = Cart.objects.filter(site=site, user=user).first()
            else:
                session_key = request.session.session_key
                cart = Cart.objects.filter(site=site, session_key=session_key).first()
                
            if not cart or not cart.items.exists():
                return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
            
            for item in cart.items.all():
                order_items.append({
                    'product': item.product,
                    'quantity': item.quantity,
                    'price_snapshot': item.price_snapshot,
                    'product_name_snapshot': item.product_name_snapshot
                })
                total_amount += item.total_price
            
            # Clear Cart
            cart.items.all().delete()

        if not order_items:
             return Response({"detail": "No items to order"}, status=status.HTTP_400_BAD_REQUEST)

        # Create Order
        order = Order.objects.create(
            site=site,
            user=user,
            total_amount=total_amount,
            first_name=request.data.get('first_name'),
            last_name=request.data.get('last_name'),
            phone_number=request.data.get('phone_number'),
            address=request.data.get('address'),
        )

        # Create Order Items
        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price_snapshot=item['price_snapshot'],
                product_name_snapshot=item['product_name_snapshot']
            )

        # Create Payment placeholder
        Payment.objects.create(
            order=order,
            amount=order.total_amount,
            provider=request.data.get('payment_provider', 'default'),
            status='pending'
        )

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def verify_payment(self, request, pk=None):
        # This would be called by a webhook or after redirect from gateway
        order = self.get_object()
        payment = order.payment
        
        # Mocking success for now
        success = request.data.get('success', True)
        transaction_id = request.data.get('transaction_id', 'MOCK_ID')
        
        if success:
            payment.status = 'completed'
            payment.transaction_id = transaction_id
            payment.save()
            
            order.status = 'paid'
            order.save()
            return Response({"detail": "Payment successful"})
        else:
            payment.status = 'failed'
            payment.save()
            return Response({"detail": "Payment failed"}, status=status.HTTP_400_BAD_REQUEST)
