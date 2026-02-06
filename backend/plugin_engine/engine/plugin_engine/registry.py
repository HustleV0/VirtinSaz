import os
import json
import importlib.util
from django.conf import settings
from .base import BasePlugin

class PluginRegistry:
    _instance = None
    _plugins = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PluginRegistry, cls).__new__(cls)
        return cls._instance

    def discover(self):
        plugins_dir = os.path.join(settings.BASE_DIR, 'plugins')
        if not os.path.exists(plugins_dir):
            return

        for plugin_slug in os.listdir(plugins_dir):
            path = os.path.join(plugins_dir, plugin_slug)
            if os.path.isdir(path):
                manifest_path = os.path.join(path, 'manifest.json')
                plugin_py_path = os.path.join(path, 'plugin.py')
                
                if os.path.exists(manifest_path) and os.path.exists(plugin_py_path):
                    with open(manifest_path, 'r') as f:
                        manifest = json.load(f)
                    
                    self._plugins[plugin_slug] = {
                        'manifest': manifest,
                        'path': path,
                        'py_path': plugin_py_path
                    }

    def get_plugin_class(self, slug):
        if slug not in self._plugins:
            self.discover()
        
        if slug not in self._plugins:
            raise ValueError(f"Plugin {slug} not found")

        plugin_info = self._plugins[slug]
        spec = importlib.util.spec_from_file_location(f"plugin_{slug}", plugin_info['py_path'])
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        
        for name, obj in module.__dict__.items():
            if isinstance(obj, type) and issubclass(obj, BasePlugin) and obj is not BasePlugin:
                return obj
        
        raise ValueError(f"No BasePlugin subclass found in {plugin_info['py_path']}")

    def get_instance(self, slug):
        plugin_class = self.get_plugin_class(slug)
        return plugin_class()

    def get_manifest(self, slug):
        if slug not in self._plugins:
            self.discover()
        return self._plugins.get(slug, {}).get('manifest')

    def all_plugins(self):
        if not self._plugins:
            self.discover()
        return self._plugins
