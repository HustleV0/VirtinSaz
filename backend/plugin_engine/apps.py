from django.apps import AppConfig


class PluginEngineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'plugin_engine'

    def ready(self):
        import plugin_engine.signals
