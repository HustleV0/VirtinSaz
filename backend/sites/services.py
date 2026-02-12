from django.db import transaction
from .models import Site, Theme, Plugin, SitePlugin

class ThemeService:
    @staticmethod
    @transaction.atomic
    def activate_theme(site: Site, theme: Theme):
        """
        Activates a theme for a site and ensures all required plugins are active.
        """
        # 1. Set the theme on the site
        site.theme = theme
        site.save()

        # 2. Activate required plugins
        required_plugins = theme.required_plugins.all()
        
        for plugin in required_plugins:
            site_plugin, created = SitePlugin.objects.get_or_create(
                site=site,
                plugin=plugin,
                defaults={'is_active': True}
            )
            
            if not created and not site_plugin.is_active:
                site_plugin.is_active = True
                site_plugin.save()
        
        return site
