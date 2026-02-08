from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ("subscription", "0002_add_rls_policies"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
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
            """,
            reverse_sql="""
            ALTER TABLE subscription_subscription DISABLE ROW LEVEL SECURITY;
            ALTER TABLE subscription_invoice DISABLE ROW LEVEL SECURITY;
            DROP POLICY IF EXISTS subscription_user_policy ON subscription_subscription;
            DROP POLICY IF EXISTS invoice_user_policy ON subscription_invoice;
            """
        ),
    ]
