from django.urls import path, include
from plugin_engine.engine.plugin_engine.registry import PluginRegistry

def get_plugin_urls():
    registry = PluginRegistry()
    registry.discover()
    
    plugin_patterns = []
    for slug, info in registry.all_plugins().items():
        try:
            plugin_instance = registry.get_instance(slug)
            routes = plugin_instance.register_api_routes()
            if routes:
                plugin_patterns.append(path(f'{slug}/', include(routes)))
        except Exception:
            continue
            
    return plugin_patterns

urlpatterns = [
    path('api/plugins/', include(get_plugin_urls())),
]
