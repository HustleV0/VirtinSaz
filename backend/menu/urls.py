from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import ProductTagViewSet, ProductCategoryViewSet, ProductViewSet, PublicMenuDataView

router = DefaultRouter()
router.register(r'tags', ProductTagViewSet)
router.register(r'categories', ProductCategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('public-data/', PublicMenuDataView.as_view(), name='public-menu-data-by-host'),
    re_path(r'^public-data/(?P<slug>[^/]+)/$', PublicMenuDataView.as_view(), name='public-menu-data'),
    path('', include(router.urls)),
]
