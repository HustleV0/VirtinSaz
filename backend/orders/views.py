from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from menu.models import Product
from .models import Cart, CartItem, Order, OrderItem, Payment
from .serializers import CartItemSerializer, CartSerializer, OrderSerializer, PaymentSerializer


class TenantSiteMixin:
    def get_tenant_and_site(self):
        tenant = getattr(self.request, 'tenant', None)
        user = self.request.user
        if not tenant and user.is_authenticated and user.tenant_id:
            tenant = user.tenant
        if not tenant:
            return None, None

        site = getattr(tenant, 'site', None)
        if not site:
            return None, None

        if user.is_authenticated and user.tenant_id and user.tenant_id != tenant.id:
            return None, None

        return tenant, site


class PaymentListView(TenantSiteMixin, generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant, site = self.get_tenant_and_site()
        if not tenant or not site:
            return Payment.objects.none()

        return Payment.objects.filter(tenant=tenant, order__site=site).select_related('order').order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        total_sum = sum(p.amount for p in queryset if p.status == 'completed')
        return Response({'payments': serializer.data, 'total_sum': total_sum})


class CartViewSet(TenantSiteMixin, viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]

    def get_cart(self):
        tenant, site = self.get_tenant_and_site()
        if not tenant or not site:
            return None

        user = self.request.user if self.request.user.is_authenticated else None

        if user:
            cart, _ = Cart.objects.get_or_create(tenant=tenant, site=site, user=user)
        else:
            if not self.request.session.session_key:
                self.request.session.create()
            session_key = self.request.session.session_key
            cart, _ = Cart.objects.get_or_create(tenant=tenant, site=site, session_key=session_key)
        return cart

    def list(self, request, *args, **kwargs):
        cart = self.get_cart()
        if not cart:
            return Response({'detail': 'Tenant not found'}, status=404)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_cart()
        if not cart:
            return Response({'detail': 'Tenant not found'}, status=404)

        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        product = get_object_or_404(Product, id=product_id, tenant=cart.tenant)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            tenant=cart.tenant,
            product=product,
            defaults={
                'price_snapshot': product.price,
                'product_name_snapshot': product.title,
            },
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
        if not cart:
            return Response({'detail': 'Tenant not found'}, status=404)

        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity'))

        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart, tenant=cart.tenant)
        if quantity <= 0:
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        cart_item.quantity = quantity
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = self.get_cart()
        if not cart:
            return Response({'detail': 'Tenant not found'}, status=404)

        item_id = request.data.get('item_id')
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart, tenant=cart.tenant)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderViewSet(TenantSiteMixin, viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action in {'create', 'verify_payment'}:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        tenant, site = self.get_tenant_and_site()
        if not tenant or not site:
            return Order.objects.none()

        queryset = Order.objects.filter(tenant=tenant).prefetch_related('items', 'payment')
        if self.action == 'verify_payment':
            return queryset

        if not user.is_authenticated:
            return queryset.none()

        if site.owner_id == user.id:
            return queryset
        return queryset.filter(user=user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        tenant, site = self.get_tenant_and_site()
        if not tenant or not site:
            return Response({'detail': 'Tenant not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else None
        items_data = request.data.get('items')

        order_items = []
        total_amount = 0

        if items_data:
            for item in items_data:
                product = get_object_or_404(Product, id=item['id'], tenant=tenant)
                order_items.append(
                    {
                        'product': product,
                        'quantity': item['quantity'],
                        'price_snapshot': product.price,
                        'product_name_snapshot': product.title,
                    }
                )
                total_amount += product.price * item['quantity']
        else:
            if user:
                cart = Cart.objects.filter(tenant=tenant, user=user).first()
            else:
                session_key = request.session.session_key
                cart = Cart.objects.filter(tenant=tenant, session_key=session_key).first()

            if not cart or not cart.items.exists():
                return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

            for item in cart.items.all():
                order_items.append(
                    {
                        'product': item.product,
                        'quantity': item.quantity,
                        'price_snapshot': item.price_snapshot,
                        'product_name_snapshot': item.product_name_snapshot,
                    }
                )
                total_amount += item.total_price

            cart.items.all().delete()

        if not order_items:
            return Response({'detail': 'No items to order'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            tenant=tenant,
            site=site,
            user=user,
            total_amount=total_amount,
            first_name=request.data.get('first_name'),
            last_name=request.data.get('last_name'),
            phone_number=request.data.get('phone_number'),
            address=request.data.get('address'),
        )

        for item in order_items:
            OrderItem.objects.create(
                tenant=tenant,
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price_snapshot=item['price_snapshot'],
                product_name_snapshot=item['product_name_snapshot'],
            )

        Payment.objects.create(
            tenant=tenant,
            order=order,
            amount=order.total_amount,
            provider=request.data.get('payment_provider', 'default'),
            status='pending',
        )

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def verify_payment(self, request, pk=None):
        order = self.get_object()
        payment = order.payment

        success = request.data.get('success', True)
        transaction_id = request.data.get('transaction_id', 'MOCK_ID')

        if success:
            payment.status = 'completed'
            payment.transaction_id = transaction_id
            payment.save()

            order.status = 'paid'
            order.save(update_fields=['status'])
            return Response({'detail': 'Payment successful'})

        payment.status = 'failed'
        payment.save(update_fields=['status'])
        return Response({'detail': 'Payment failed'}, status=status.HTTP_400_BAD_REQUEST)
