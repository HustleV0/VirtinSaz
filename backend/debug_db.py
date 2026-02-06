from sites.models import Site
print(f"Count: {Site.objects.count()}")
for s in Site.objects.all():
    print(f"'{s.slug}'")
