from plugin_engine.engine.template_engine.registry import TemplateRegistry
from plugin_engine.engine.plugin_engine.registry import PluginRegistry
from plugin_engine.models import SitePlugin

class DashboardBuilder:
    @staticmethod
    def build_for_site(user, site):
        template_registry = TemplateRegistry()
        plugin_registry = PluginRegistry()
        
        template_slug = site.theme.slug if site.theme else 'default'
        try:
            template = template_registry.get_instance(template_slug, site)
        except Exception:
            # Fallback or error handling
            return {"error": f"Template {template_slug} not found"}

        sections = template.get_dashboard_layout(user)
        dashboard_config = []

        active_plugin_slugs = SitePlugin.objects.filter(
            site=site, is_active=True
        ).values_list('plugin_slug', flat=True)

        for section in sections:
            plugin_slug = section.get('plugin')
            if plugin_slug in active_plugin_slugs:
                try:
                    plugin = plugin_registry.get_instance(plugin_slug)
                    widgets = plugin.get_dashboard_widgets(user, site)
                    
                    dashboard_config.append({
                        "section_title": section.get("title"),
                        "widgets": widgets
                    })
                except Exception:
                    continue
        
        return dashboard_config
