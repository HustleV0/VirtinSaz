import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from sites.models import Plugin, Theme

def run():
    # 1. Create Plugins
    menu_plugin, _ = Plugin.objects.update_or_create(
        key='menu',
        defaults={
            'name': 'مدیریت منو',
            'description': 'مدیریت دسته‌بندی‌ها و محصولات منوی شما.',
            'is_core': True
        }
    )
    
    order_plugin, _ = Plugin.objects.update_or_create(
        key='order',
        defaults={
            'name': 'مدیریت سفارشات',
            'description': 'امکان ثبت سفارش آنلاین توسط مشتریان.',
            'is_core': False
        }
    )
    
    blog_plugin, _ = Plugin.objects.update_or_create(
        key='blog',
        defaults={
            'name': 'بلاگ',
            'description': 'انتشار اخبار و مقالات مرتبط با کسب و کار.',
            'is_core': False
        }
    )
    
    ecommerce_plugin, _ = Plugin.objects.update_or_create(
        key='ecommerce',
        defaults={
            'name': 'تجارت الکترونیک (E-commerce)',
            'description': 'ویژگی‌های پیشرفته فروشگاه و درگاه پرداخت.',
            'is_core': False
        }
    )

    analytics_plugin, _ = Plugin.objects.update_or_create(
        key='analytics',
        defaults={
            'name': 'آنالیز و آمار',
            'description': 'بررسی عملکرد و آمار بازدید وبسایت.',
            'is_core': True
        }
    )

    # 2. Update minimal-cafe Theme
    theme = Theme.objects.filter(slug='minimal-cafe').first()
    if theme:
        theme.required_plugins.clear()
        theme.required_plugins.add(menu_plugin, order_plugin, analytics_plugin)
        print(f"Updated {theme.name} with required plugins.")
    else:
        print("Theme minimal-cafe not found. Creating it...")
        # Fallback if theme doesn't exist in DB yet
        theme = Theme.objects.create(
            name='Minimal Cafe',
            slug='minimal-cafe',
            source_identifier='minimal-cafe'
        )
        theme.required_plugins.add(menu_plugin, order_plugin, analytics_plugin)

    print("Plugin and Theme initialization complete.")

if __name__ == '__main__':
    run()
