from django.db import migrations

def enable_rls(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return

    schema_editor.execute("""
        -- Enable RLS on tables
        ALTER TABLE subscription_subscription ENABLE ROW LEVEL SECURITY;
        ALTER TABLE subscription_invoice ENABLE ROW LEVEL SECURITY;

        -- Create Policy for Subscription
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'subscription_user_policy') THEN
                CREATE POLICY subscription_user_policy ON subscription_subscription
                FOR ALL
                USING (user_id = current_setting('app.current_user_id', TRUE)::integer);
            END IF;
        END $$;

        -- Create Policy for Invoice
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'invoice_user_policy') THEN
                CREATE POLICY invoice_user_policy ON subscription_invoice
                FOR ALL
                USING (user_id = current_setting('app.current_user_id', TRUE)::integer);
            END IF;
        END $$;
    """)

def disable_rls(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return

    schema_editor.execute("""
        ALTER TABLE subscription_subscription DISABLE ROW LEVEL SECURITY;
        ALTER TABLE subscription_invoice DISABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS subscription_user_policy ON subscription_subscription;
        DROP POLICY IF EXISTS invoice_user_policy ON subscription_invoice;
    """)

class Migration(migrations.Migration):
    dependencies = [
        ("subscription", "0002_add_rls_policies"),
    ]

    operations = [
        migrations.RunPython(enable_rls, reverse_code=disable_rls),
    ]
