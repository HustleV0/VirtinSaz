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
    has_site = u.sites.exists()
    site_count = u.sites.count()
    print(f"{u.phone_number}: {site_count} Site(s)")
