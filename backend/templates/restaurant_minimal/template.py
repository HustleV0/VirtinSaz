from plugin_engine.engine.template_engine.base import BaseTemplate

class RestaurantMinimalTemplate(BaseTemplate):
    def get_required_plugins(self):
        return ["menu_management"]

    def get_dashboard_layout(self, user):
        return [
            {
                "title": "Menu Overview",
                "plugin": "menu_management"
            }
        ]

    def validate_settings(self, settings):
        return "primary_color" in settings
