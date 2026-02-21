from django.db import migrations, models
import django.db.models.deletion


def backfill_orders_tenant(apps, schema_editor):
    Tenant = apps.get_model("tenants", "Tenant")
    Cart = apps.get_model("orders", "Cart")
    CartItem = apps.get_model("orders", "CartItem")
    Order = apps.get_model("orders", "Order")
    OrderItem = apps.get_model("orders", "OrderItem")
    Payment = apps.get_model("orders", "Payment")

    site_to_tenant = dict(
        Tenant.objects.exclude(site_id__isnull=True).values_list("site_id", "id")
    )

    for cart in Cart.objects.all().only("id", "site_id").iterator():
        tenant_id = site_to_tenant.get(cart.site_id)
        if tenant_id:
            Cart.objects.filter(id=cart.id).update(tenant_id=tenant_id)

    for order in Order.objects.all().only("id", "site_id").iterator():
        tenant_id = site_to_tenant.get(order.site_id)
        if tenant_id:
            Order.objects.filter(id=order.id).update(tenant_id=tenant_id)

    for item in CartItem.objects.all().only("id", "cart_id").iterator():
        cart_tenant_id = Cart.objects.filter(id=item.cart_id).values_list("tenant_id", flat=True).first()
        if cart_tenant_id:
            CartItem.objects.filter(id=item.id).update(tenant_id=cart_tenant_id)

    for item in OrderItem.objects.all().only("id", "order_id").iterator():
        order_tenant_id = Order.objects.filter(id=item.order_id).values_list("tenant_id", flat=True).first()
        if order_tenant_id:
            OrderItem.objects.filter(id=item.id).update(tenant_id=order_tenant_id)

    for payment in Payment.objects.all().only("id", "order_id").iterator():
        order_tenant_id = Order.objects.filter(id=payment.order_id).values_list("tenant_id", flat=True).first()
        if order_tenant_id:
            Payment.objects.filter(id=payment.id).update(tenant_id=order_tenant_id)


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0002_alter_order_total_amount"),
        ("tenants", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="cart",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_cart_rows", to="tenants.tenant"),
        ),
        migrations.AddField(
            model_name="cartitem",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_cartitem_rows", to="tenants.tenant"),
        ),
        migrations.AddField(
            model_name="order",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_order_rows", to="tenants.tenant"),
        ),
        migrations.AddField(
            model_name="orderitem",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_orderitem_rows", to="tenants.tenant"),
        ),
        migrations.AddField(
            model_name="payment",
            name="tenant",
            field=models.ForeignKey(blank=True, db_index=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_payment_rows", to="tenants.tenant"),
        ),
        migrations.RunPython(backfill_orders_tenant, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="cart",
            name="tenant",
            field=models.ForeignKey(db_index=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_cart_rows", to="tenants.tenant"),
        ),
        migrations.AlterField(
            model_name="cartitem",
            name="tenant",
            field=models.ForeignKey(db_index=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_cartitem_rows", to="tenants.tenant"),
        ),
        migrations.AlterField(
            model_name="order",
            name="tenant",
            field=models.ForeignKey(db_index=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_order_rows", to="tenants.tenant"),
        ),
        migrations.AlterField(
            model_name="orderitem",
            name="tenant",
            field=models.ForeignKey(db_index=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_orderitem_rows", to="tenants.tenant"),
        ),
        migrations.AlterField(
            model_name="payment",
            name="tenant",
            field=models.ForeignKey(db_index=True, on_delete=django.db.models.deletion.CASCADE, related_name="orders_payment_rows", to="tenants.tenant"),
        ),
        migrations.AddIndex(
            model_name="cart",
            index=models.Index(fields=["tenant", "user"], name="orders_cart_tenant_user_idx"),
        ),
        migrations.AddIndex(
            model_name="cart",
            index=models.Index(fields=["tenant", "session_key"], name="orders_cart_tenant_session_idx"),
        ),
        migrations.AddIndex(
            model_name="order",
            index=models.Index(fields=["tenant", "status"], name="orders_order_tenant_status_idx"),
        ),
    ]
