import os
import sys
import django

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'
django.setup()

from django.contrib.auth import get_user_model
from sites.models import Site

User = get_user_model()
users = User.objects.all()
print("Users and their sites:")
for u in users:
    has_site = hasattr(u, 'site')
    print(f"{u.phone_number}: {'Has Site' if has_site else 'No Site'}")
