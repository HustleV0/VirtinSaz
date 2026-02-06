import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from sites.models import Site

site = Site.objects.first()
if site:
    target_slug = "کافه-آنس"
    site.slug = target_slug
    site.save()
    print(f"Updated: {site.slug}")
else:
    print("No site found")
