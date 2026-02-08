from django.urls import path
from .views import (
    PlanListView, ZarinPalRequestView, ZarinPalCallbackView,
    SubscriptionMeView
)

urlpatterns = [
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('me/', SubscriptionMeView.as_view(), name='subscription-me'),
    path('zarinpal/request/', ZarinPalRequestView.as_view(), name='zarinpal-request'),
    path('zarinpal/callback/', ZarinPalCallbackView.as_view(), name='zarinpal-callback'),
]
