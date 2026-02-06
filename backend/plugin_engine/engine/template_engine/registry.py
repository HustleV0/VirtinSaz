import os
import json
import importlib.util
from django.conf import settings
from .base import BaseTemplate

class TemplateRegistry:
    _instance = None
    _templates = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TemplateRegistry, cls).__new__(cls)
        return cls._instance

    def discover(self):
        templates_dir = os.path.join(settings.BASE_DIR, 'templates')
        if not os.path.exists(templates_dir):
            return

        for template_slug in os.listdir(templates_dir):
            path = os.path.join(templates_dir, template_slug)
            if os.path.isdir(path):
                manifest_path = os.path.join(path, 'manifest.json')
                template_py_path = os.path.join(path, 'template.py')
                
                if os.path.exists(manifest_path) and os.path.exists(template_py_path):
                    with open(manifest_path, 'r') as f:
                        manifest = json.load(f)
                    
                    self._templates[template_slug] = {
                        'manifest': manifest,
                        'path': path,
                        'py_path': template_py_path
                    }

    def get_template_class(self, slug):
        if slug not in self._templates:
            self.discover()
        
        if slug not in self._templates:
            raise ValueError(f"Template {slug} not found")

        template_info = self._templates[slug]
        spec = importlib.util.spec_from_file_location(f"template_{slug}", template_info['py_path'])
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        
        for name, obj in module.__dict__.items():
            if isinstance(obj, type) and issubclass(obj, BaseTemplate) and obj is not BaseTemplate:
                return obj
        
        raise ValueError(f"No BaseTemplate subclass found in {template_info['py_path']}")

    def get_instance(self, slug, site):
        template_class = self.get_template_class(slug)
        return template_class(site)

    def get_manifest(self, slug):
        if slug not in self._templates:
            self.discover()
        return self._templates.get(slug, {}).get('manifest')
