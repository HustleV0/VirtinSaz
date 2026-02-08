from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework import views, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Plan, Subscription
from .serializers import PlanSerializer
from .gateways import ZarinPalGateway
from .services import SubscriptionService
from accounts.models import User

class PlanListView(generics.ListAPIView):
    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class SubscriptionMeView(views.APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # اگر کاربر لاگین بود اما اشتراک نداشت یا لاگین نبود
        user = request.user
        if not user or not user.is_authenticated:
            return Response({"status": "unauthenticated", "message": "لطفاً وارد شوید"}, status=status.HTTP_200_OK)
            
        try:
            subscription = user.subscription
            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data)
        except Exception:
            # اگر کاربر اشتراک نداشت، پلن پیش‌فرض را برگردان
            default_plan = Plan.objects.filter(is_default=True, is_active=True).first()
            return Response({
                "status": "no_subscription",
                "plan": PlanSerializer(default_plan).data if default_plan else None,
                "message": "اشتراک فعالی یافت نشد"
            }, status=status.HTTP_200_OK)

class ZarinPalRequestView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get('plan_id')
        try:
            plan = Plan.objects.get(id=plan_id, is_active=True)
            callback_url = request.build_absolute_uri('/api/subscription/zarinpal/callback/')
            
            # Amount should be in Toman for ZarinPal
            result = ZarinPalGateway.request_payment(
                amount=plan.price,
                description=f"Subscription for {plan.name}",
                email=request.user.email,
                mobile="", # Add mobile field to user model if needed
                callback_url=callback_url
            )
            
            if result:
                return Response(result)
            return Response({'error': 'Payment request failed'}, status=status.HTTP_400_BAD_REQUEST)
        except Plan.DoesNotExist:
            return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)

class ZarinPalCallbackView(views.APIView):
    def get(self, request):
        status_param = request.GET.get('Status')
        authority = request.GET.get('Authority')
        
        if status_param == 'OK':
            # Verification logic here
            return Response({'message': 'Payment verification required'})
            
        return Response({'error': 'Payment failed'}, status=status.HTTP_400_BAD_REQUEST)
