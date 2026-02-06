from sites.models import Site
from django.utils.text import slugify

print("Listing all sites and their slugs:")
for s in Site.objects.all():
    print(f"ID: {s.id} | Name: '{s.name}' | Slug: '{s.slug}'")
    expected = slugify(s.name, allow_unicode=True)
    if s.slug != expected:
        print(f"  --> MISMATCH! Expected slug: '{expected}'")
