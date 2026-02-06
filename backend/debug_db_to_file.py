from sites.models import Site
with open('db_output.txt', 'w', encoding='utf-8') as f:
    f.write(f"Count: {Site.objects.count()}\n")
    for s in Site.objects.all():
        f.write(f"Slug: '{s.slug}'\n")
