from django.db import migrations, models
import django.db.models.deletion


def backfill_user_tenant(apps, schema_editor):
    Site = apps.get_model("sites", "Site")
    Tenant = apps.get_model("tenants", "Tenant")
    User = apps.get_model("accounts", "User")

    site_to_tenant = dict(
        Tenant.objects.exclude(site_id__isnull=True).values_list("site_id", "id")
    )

    for site in Site.objects.all().iterator():
        tenant_id = site_to_tenant.get(site.id)
        if tenant_id:
            User.objects.filter(id=site.owner_id, tenant_id__isnull=True).update(tenant_id=tenant_id)


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0009_delete_otp_user_username_alter_user_phone_number"),
        ("tenants", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="users", to="tenants.tenant"),
        ),
        migrations.RunPython(backfill_user_tenant, migrations.RunPython.noop),
    ]
