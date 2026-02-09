import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from sites.models import Plugin, Theme

def run():
    # 1. Create Plugins
    menu_plugin, _ = Plugin.objects.get_or_create(
        key='menu',
        defaults={
            'name': 'Menu Management',
            'description': 'Manage categories and products.',
            'is_core': True
        }
    )
    
    order_plugin, _ = Plugin.objects.get_or_create(
        key='order',
        defaults={
            'name': 'Order Management',
            'description': 'Allow users to place orders.',
            'is_core': False
        }
    )
    
    blog_plugin, _ = Plugin.objects.get_or_create(
        key='blog',
        defaults={
            'name': 'Blog',
            'description': 'Post news and articles.',
            'is_core': False
        }
    )
    
    ecommerce_plugin, _ = Plugin.objects.get_or_create(
        key='ecommerce',
        defaults={
            'name': 'E-commerce',
            'description': 'Advanced store features.',
            'is_core': False
        }
    )

    # 2. Update minimal-cafe Theme
    theme = Theme.objects.filter(slug='minimal-cafe').first()
    if theme:
        theme.required_plugins.add(menu_plugin, order_plugin)
        print(f"Updated {theme.name} with required plugins.")
    else:
        print("Theme minimal-cafe not found. Creating it...")
        # Fallback if theme doesn't exist in DB yet
        theme = Theme.objects.create(
            name='Minimal Cafe',
            slug='minimal-cafe',
            source_identifier='minimal-cafe'
        )
        theme.required_plugins.add(menu_plugin, order_plugin)

    print("Plugin and Theme initialization complete.")

if __name__ == '__main__':
    run()
