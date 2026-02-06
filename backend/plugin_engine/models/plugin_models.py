from django.db import models

class TemplateManifest(models.Model):
    slug = models.SlugField(unique=True)
    version = models.CharField(max_length=50)
    manifest_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.slug} (v{self.version})"

class PluginManifest(models.Model):
    slug = models.SlugField(unique=True)
    version = models.CharField(max_length=50)
    manifest_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.slug} (v{self.version})"

class SitePlugin(models.Model):
    ACTIVATION_SOURCES = [
        ('manual', 'Manual'),
        ('template_required', 'Template Required'),
        ('dependency', 'Dependency'),
    ]

    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE, related_name='active_plugins')
    plugin_slug = models.SlugField()
    activation_source = models.CharField(max_length=20, choices=ACTIVATION_SOURCES)
    settings = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    activated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('site', 'plugin_slug')

    def __str__(self):
        return f"{self.plugin_slug} on {self.site.name}"
