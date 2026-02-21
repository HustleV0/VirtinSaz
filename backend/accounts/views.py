from rest_framework import status, views, permissions, generics
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                user_data = UserSerializer(user).data
                
                # Get tokens from serializer method
                refresh = RefreshToken.for_user(user)
                user_data['tokens'] = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                
                return Response(user_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            import traceback
            print("--- REGISTRATION ERROR ---")
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Humanize errors
        errors = serializer.errors
        error_msg = "خطا در ثبت‌نام"
        if 'phone_number' in errors:
            error_msg = "این شماره موبایل قبلاً ثبت‌نام شده است"
        elif 'email' in errors:
            error_msg = "این ایمیل قبلاً ثبت‌نام شده است"
        elif 'site_slug' in errors:
            error_msg = "این آدرس سایت قبلاً رزرو شده است"
        
        return Response({'error': error_msg, 'details': errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        tenant = getattr(request, 'tenant', None)
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            if tenant and user.tenant_id and user.tenant_id != tenant.id:
                return Response({'error': 'Tenant mismatch for this user account'}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'نام کاربری یا رمز عبور اشتباه است'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
