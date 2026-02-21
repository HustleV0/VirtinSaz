from django.db import migrations, models
import django.db.models.deletion


def backfill_menu_tenant(apps, schema_editor):
    Tenant = apps.get_model("tenants", "Tenant")
    ProductTag = apps.get_model("menu", "ProductTag")
    ProductCategory = apps.get_model("menu", "ProductCategory")
    Product = apps.get_model("menu", "Product")

    site_to_tenant = dict(
        Tenant.objects.exclude(site_id__isnull=True).values_list("site_id", "id")
    )

    for model in (ProductTag, ProductCategory, Product):
        for row in model.objects.all().only("id", "site_id").iterator():
            tenant_id = site_to_tenant.get(row.site_id)
            if tenant_id:
                model.objects.filter(id=row.id).update(tenant_id=tenant_id)


class Migration(migrations.Migration):

    dependencies = [
        ("menu", "0006_alter_product_id_alter_productcategory_id_and_more"),
        ("tenants", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="menu_product_rows", to="tenants.tenant"),
        ),
        migrations.AddField(
            model_name="productcategory",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="menu_productcategory_rows", to="tenants.tenant"),
        ),
        migrations.AddField(
            model_name="producttag",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="menu_producttag_rows", to="tenants.tenant"),
        ),
        migrations.RunPython(backfill_menu_tenant, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="product",
            name="tenant",
            field=models.ForeignKey(db_index=True, on_delete=django.db.models.deletion.CASCADE, related_name="menu_product_rows", to="tenants.tenant"),
        ),
        migrations.AlterField(
            model_name="productcategory",
            name="tenant",
            field=models.ForeignKey(db_index=True, on_delete=django.db.models.deletion.CASCADE, related_name="menu_productcategory_rows", to="tenants.tenant"),
        ),
        migrations.AlterField(
            model_name="producttag",
            name="tenant",
            field=models.ForeignKey(db_index=True, on_delete=django.db.models.deletion.CASCADE, related_name="menu_producttag_rows", to="tenants.tenant"),
        ),
    ]
