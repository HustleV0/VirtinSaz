from django.db import models
from django.conf import settings

class SiteCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, allow_unicode=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Site Categories"

class Plugin(models.Model):
    key = models.SlugField(max_length=255, unique=True, allow_unicode=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    is_core = models.BooleanField(default=False)
    is_usable = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Theme(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, allow_unicode=True)
    category = models.ForeignKey(SiteCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='themes')
    required_plugins = models.ManyToManyField(Plugin, blank=True, related_name='themes')
    site_types = models.JSONField(default=list, blank=True, help_text="List of SiteCategory slugs this theme supports")
    preview_image = models.ImageField(upload_to='theme_previews/')
    preview_url = models.URLField(max_length=500, null=True, blank=True)
    tag = models.CharField(max_length=50, null=True, blank=True, help_text="e.g. New, Special")
    description = models.TextField(null=True, blank=True)
    source_identifier = models.CharField(max_length=255, help_text="Used by frontend to load theme assets")
    config = models.JSONField(default=dict, blank=True, help_text="Modular theme configuration")
    default_settings = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Site(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sites')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, allow_unicode=True, null=True, blank=True)
    logo = models.ImageField(upload_to='site_logos/', null=True, blank=True)
    cover_image = models.ImageField(upload_to='site_covers/', null=True, blank=True)
    category = models.ForeignKey(SiteCategory, on_delete=models.PROTECT, related_name='sites')
    theme = models.ForeignKey(Theme, on_delete=models.PROTECT, related_name='sites', null=True, blank=True)
    settings = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    subscription_ends_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.trial_ends_at:
            from django.utils import timezone
            from datetime import timedelta
            self.trial_ends_at = self.created_at + timedelta(hours=24)
            self.save(update_fields=['trial_ends_at'])

    @staticmethod
    def get_or_create_for_user(user):
        if not user.is_authenticated:
            return None
        
        site = user.sites.first()
        if site:
            return site
            
        # Fallback for users registered without a site
        category, _ = SiteCategory.objects.get_or_create(
            slug='general',
            defaults={'name': 'General'}
        )
        theme, _ = Theme.objects.get_or_create(
            slug='default',
            defaults={
                'name': 'Default Theme',
                'category': category,
                'source_identifier': 'default'
            }
        )
        from django.utils.text import slugify
        
        site, created = Site.objects.get_or_create(
            owner=user,
            defaults={
                'name': getattr(user, 'restaurant_name', '') or f"Site for {user.phone_number}",
                'slug': slugify(getattr(user, 'restaurant_name', '') or f"site-{user.phone_number}", allow_unicode=True),
                'category': category,
                'theme': theme,
                'settings': theme.default_settings
            }
        )
        
        if created:
            from .services import ThemeService
            ThemeService.activate_theme(site, theme)
            
        return site

    def is_plugin_active(self, plugin_key):
        return self.site_plugins.filter(plugin__key=plugin_key, is_active=True).exists()

    def get_active_plugins(self):
        return [sp.plugin.key for sp in self.site_plugins.filter(is_active=True)]

    def __str__(self):
        return f"{self.name} - {self.owner.phone_number}"

class SitePlugin(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='site_plugins')
    plugin = models.ForeignKey(Plugin, on_delete=models.CASCADE, related_name='site_plugins')
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('site', 'plugin')

    def __str__(self):
        return f"{self.plugin.name} on {self.site.name}"
