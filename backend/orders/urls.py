from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import CartViewSet, OrderViewSet

router = SimpleRouter()
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
