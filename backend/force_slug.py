from sites.models import Site
from django.utils.text import slugify

# Force set the slug for the existing site
site = Site.objects.first()
if site:
    # Use the exact characters from the logs
    target_slug = "کافه-آنس"
    site.slug = target_slug
    site.save()
    print(f"Successfully updated slug for '{site.name}' to '{site.slug}'")
else:
    print("No site found to update.")
