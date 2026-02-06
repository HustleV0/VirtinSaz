from django.dispatch import Signal, receiver
from .engine.plugin_engine.activator import PluginActivator
from .engine.template_engine.registry import TemplateRegistry

theme_changed = Signal()

@receiver(theme_changed)
def handle_theme_changed(sender, site, template_slug, **kwargs):
    """
    Handles auto-activation of plugins when a theme (template) is changed.
    """
    registry = TemplateRegistry()
    manifest = registry.get_manifest(template_slug)
    
    if not manifest:
        return
    
    required_plugins = manifest.get('required_plugins', [])
    activator = PluginActivator()
    
    for plugin_slug in required_plugins:
        activator.activate_for_site(site, plugin_slug, source='template_required')
