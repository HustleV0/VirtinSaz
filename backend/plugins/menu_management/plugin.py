from plugin_engine.engine.plugin_engine.base import BasePlugin
from .dashboard.widgets import MenuStatsWidget

class MenuManagementPlugin(BasePlugin):
    def activate(self, site):
        print(f"Activating menu_management for site {site.name}")

    def deactivate(self, site):
        print(f"Deactivating menu_management for site {site.name}")

    def get_dashboard_widgets(self, user, site):
        return [
            MenuStatsWidget().to_dict()
        ]

    def register_api_routes(self):
        # In a real scenario, this would return a list of paths
        # For now, returning empty to avoid complex URL config in example
        return []
