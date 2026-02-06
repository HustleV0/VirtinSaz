from rest_framework import status, views, permissions, generics
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import random
from .models import User, OTP
from .serializers import UserSerializer, RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class SendOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({'error': 'شماره موبایل الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists
        if User.objects.filter(phone_number=phone_number).exists():
            return Response({'error': 'کاربری با این شماره موبایل قبلاً ثبت‌نام کرده است'}, status=status.HTTP_400_BAD_REQUEST)

        last_otp = OTP.objects.filter(phone_number=phone_number).order_by('-created_at').first()
        if last_otp and timezone.now() - last_otp.created_at < timedelta(seconds=60):
            return Response({'error': 'لطفاً ۶۰ ثانیه قبل از درخواست مجدد کد صبر کنید'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        code = str(random.randint(100000, 999999))
        OTP.objects.create(phone_number=phone_number, code=code)
        print(f"OTP for {phone_number}: {code}")
        return Response({'message': 'کد تایید با موفقیت ارسال شد'})

class VerifyOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        phone_number = request.data.get('phone_number')
        code = request.data.get('code')
        if not phone_number or not code:
            return Response({'error': 'شماره موبایل و کد تایید الزامی هستند'}, status=status.HTTP_400_BAD_REQUEST)
        otp = OTP.objects.filter(phone_number=phone_number, code=code, is_used=False).order_by('-created_at').first()
        if not otp:
            return Response({'error': 'کد تایید اشتباه است'}, status=status.HTTP_400_BAD_REQUEST)
        if timezone.now() - otp.created_at > timedelta(minutes=5):
            return Response({'error': 'کد تایید منقضی شده است'}, status=status.HTTP_400_BAD_REQUEST)
        otp.is_used = True
        otp.save()
        return Response({'message': 'شماره موبایل با موفقیت تایید شد'})

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
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
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        user = User.objects.filter(phone_number=phone_number).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'شماره موبایل یا رمز عبور اشتباه است'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
