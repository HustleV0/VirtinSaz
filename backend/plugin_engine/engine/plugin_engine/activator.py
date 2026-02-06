from plugin_engine.models import SitePlugin
from plugin_engine.engine.plugin_engine.registry import PluginRegistry
from plugin_engine.engine.dependency_resolver.resolver import DependencyResolver

class PluginActivator:
    def __init__(self):
        self.registry = PluginRegistry()
        self.resolver = DependencyResolver(self.registry)

    def activate_for_site(self, site, plugin_slug, source='manual'):
        """Activates a single plugin and its dependencies."""
        activation_order = self.resolver.resolve([plugin_slug])
        
        for slug in activation_order:
            self._activate_single(site, slug, source if slug == plugin_slug else 'dependency')

    def _activate_single(self, site, slug, source):
        site_plugin, created = SitePlugin.objects.get_or_create(
            site=site,
            plugin_slug=slug,
            defaults={'activation_source': source}
        )
        
        if not site_plugin.is_active:
            site_plugin.is_active = True
            site_plugin.save()
            
        if created or site_plugin.is_active:
            plugin_instance = self.registry.get_instance(slug)
            plugin_instance.activate(site)

    def deactivate_for_site(self, site, plugin_slug):
        try:
            site_plugin = SitePlugin.objects.get(site=site, plugin_slug=plugin_slug)
            site_plugin.is_active = False
            site_plugin.save()
            
            plugin_instance = self.registry.get_instance(plugin_slug)
            plugin_instance.deactivate(site)
        except SitePlugin.DoesNotExist:
            pass
