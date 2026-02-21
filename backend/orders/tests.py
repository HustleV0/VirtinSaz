from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from menu.models import Product, ProductCategory
from sites.models import Site, SiteCategory
from tenants.services import ensure_tenant_for_site
from .models import Order

User = get_user_model()


class OrderWorkflowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='owner1', phone_number='09123456789', password='password')
        self.category = SiteCategory.objects.create(name='Cafe', slug='cafe')
        self.site = Site.objects.create(owner=self.user, name='My Cafe', slug='my-cafe', subdomain='my-cafe', category=self.category)
        self.tenant = ensure_tenant_for_site(self.site)
        self.host = f'{self.tenant.subdomain}.vofino.ir'

        self.prod_cat = ProductCategory.objects.create(
            site=self.site,
            tenant=self.tenant,
            name='Coffee',
            slug='coffee',
        )
        self.product = Product.objects.create(
            site=self.site,
            tenant=self.tenant,
            category=self.prod_cat,
            title='Espresso',
            price=50000,
            slug='espresso',
        )

    def test_cart_to_order_workflow(self):
        response = self.client.post(
            '/api/orders/cart/add_item/',
            {'product_id': self.product.id, 'quantity': 2},
            HTTP_HOST=self.host,
        )
        self.assertEqual(response.status_code, 201)

        response = self.client.get('/api/orders/cart/', HTTP_HOST=self.host)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['total_amount'], 100000)

        checkout_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'phone_number': '09123456789',
            'address': '123 Test St',
            'payment_provider': 'zarinpal',
        }
        response = self.client.post('/api/orders/', checkout_data, HTTP_HOST=self.host)
        self.assertEqual(response.status_code, 201)

        order_id = response.data['id']
        order = Order.objects.get(id=order_id)
        self.assertEqual(order.total_amount, 100000)
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.payment.status, 'pending')

        response = self.client.post(
            f'/api/orders/{order_id}/verify_payment/',
            {'success': True, 'transaction_id': 'TXN123'},
            HTTP_HOST=self.host,
        )
        self.assertEqual(response.status_code, 200)

        order.refresh_from_db()
        self.assertEqual(order.status, 'paid')
        self.assertEqual(order.payment.status, 'completed')

        response = self.client.get('/api/orders/cart/', HTTP_HOST=self.host)
        self.assertEqual(len(response.data['items']), 0)
