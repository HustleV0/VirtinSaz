import os
import django
import sys

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'
sys.path.append(os.getcwd())
django.setup()

from accounts.serializers import RegisterSerializer
from accounts.models import User

data = {
    "username": "testuser_unique",
    "phone_number": "09121234567",
    "full_name": "Test User",
    "password": "testpass123"
}

serializer = RegisterSerializer(data=data)
if serializer.is_valid():
    try:
        user = serializer.save()
        print(f"User created: {user.username}")
    except Exception as e:
        import traceback
        traceback.print_exc()
else:
    print(f"Validation errors: {serializer.errors}")
