from django.db import migrations, models
import django.db.models.deletion
from django.utils.text import slugify


def create_tenants_for_existing_sites(apps, schema_editor):
    Site = apps.get_model("sites", "Site")
    Tenant = apps.get_model("tenants", "Tenant")

    used = set(Tenant.objects.values_list("subdomain", flat=True))

    for site in Site.objects.all().iterator():
        base = slugify(site.subdomain or site.slug or f"site-{site.id}", allow_unicode=False) or f"tenant-{site.id}"
        candidate = base
        seq = 2
        while candidate in used:
            candidate = f"{base}-{seq}"
            seq += 1

        Tenant.objects.create(
            name=site.name,
            subdomain=candidate,
            plan="free",
            status="active",
            site_id=site.id,
        )
        used.add(candidate)


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("sites", "0017_usersubdomain"),
    ]

    operations = [
        migrations.CreateModel(
            name="Tenant",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("subdomain", models.SlugField(db_index=True, max_length=100, unique=True)),
                ("custom_domain", models.CharField(blank=True, db_index=True, max_length=255, null=True, unique=True)),
                ("plan", models.CharField(choices=[("free", "Free"), ("pro", "Pro"), ("enterprise", "Enterprise")], default="free", max_length=20)),
                ("status", models.CharField(choices=[("active", "Active"), ("suspended", "Suspended"), ("disabled", "Disabled")], default="active", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("site", models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="tenant", to="sites.site")),
            ],
            options={
                "db_table": "tenants",
                "indexes": [models.Index(fields=["status"], name="tenants_status_idx")],
            },
        ),
        migrations.RunPython(create_tenants_for_existing_sites, migrations.RunPython.noop),
    ]
