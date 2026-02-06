from sites.models import Site
import sys

# Set encoding for output to handle Persian characters
for s in Site.objects.all():
    print(f"SITE_DEBUG: Name='{s.name}' Slug='{s.slug}'")
