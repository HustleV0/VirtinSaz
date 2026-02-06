import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from sites.models import SiteCategory
categories = list(SiteCategory.objects.all())
print(f"Found {len(categories)} categories")
for cat in categories:
    print(f"ID: {cat.id}, Name: {cat.name}")
