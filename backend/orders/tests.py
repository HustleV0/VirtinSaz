from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from sites.models import Site, SiteCategory
from menu.models import Product, ProductCategory
from .models import Cart, Order

User = get_user_model()

class OrderWorkflowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(phone_number='09123456789', password='password')
        self.category = SiteCategory.objects.create(name='Cafe', slug='cafe')
        self.site = Site.objects.create(owner=self.user, name='My Cafe', slug='my-cafe', category=self.category)
        self.prod_cat = ProductCategory.objects.create(site=self.site, name='Coffee', slug='coffee')
        self.product = Product.objects.create(
            site=self.site, 
            category=self.prod_cat, 
            title='Espresso', 
            price=50000, 
            slug='espresso'
        )

    def test_cart_to_order_workflow(self):
        # 1. Add to Cart
        response = self.client.post('/api/orders/cart/add_item/', {
            'site_slug': 'my-cafe',
            'product_id': self.product.id,
            'quantity': 2
        })
        self.assertEqual(response.status_code, 201)
        
        # 2. View Cart
        response = self.client.get('/api/orders/cart/', {'site_slug': 'my-cafe'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['items']), 1)
        self.assertEqual(response.data['total_amount'], 100000)

        # 3. Checkout
        checkout_data = {
            'site_slug': 'my-cafe',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone_number': '09123456789',
            'address': '123 Test St',
            'payment_provider': 'zarinpal'
        }
        response = self.client.post('/api/orders/orders/', checkout_data)
        self.assertEqual(response.status_code, 201)
        
        order_id = response.data['id']
        order = Order.objects.get(id=order_id)
        self.assertEqual(order.total_amount, 100000)
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.payment.status, 'pending')

        # 4. Verify Payment (Mock)
        response = self.client.post(f'/api/orders/orders/{order_id}/verify_payment/', {
            'success': True,
            'transaction_id': 'TXN123'
        })
        self.assertEqual(response.status_code, 200)
        
        order.refresh_from_db()
        self.assertEqual(order.status, 'paid')
        self.assertEqual(order.payment.status, 'completed')
        
        # 5. Cart should be empty now
        response = self.client.get('/api/orders/cart/', {'site_slug': 'my-cafe'})
        self.assertEqual(len(response.data['items']), 0)
