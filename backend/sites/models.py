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

class Template(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, allow_unicode=True)
    category = models.ForeignKey(SiteCategory, on_delete=models.PROTECT, related_name='templates')
    preview_image = models.ImageField(upload_to='template_previews/')
    tag = models.CharField(max_length=50, null=True, blank=True, help_text="e.g. New, Special")
    description = models.TextField(null=True, blank=True)
    source_identifier = models.CharField(max_length=255, help_text="Used by frontend to load template assets")
    default_settings = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class Site(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='site')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, allow_unicode=True, null=True, blank=True)
    logo = models.ImageField(upload_to='site_logos/', null=True, blank=True)
    cover_image = models.ImageField(upload_to='site_covers/', null=True, blank=True)
    category = models.ForeignKey(SiteCategory, on_delete=models.PROTECT, related_name='sites')
    template = models.ForeignKey(Template, on_delete=models.PROTECT, related_name='sites')
    settings = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get_or_create_for_user(user):
        if not user.is_authenticated:
            return None
        
        site = getattr(user, 'site', None)
        if site:
            return site
            
        # Fallback for users registered without a site
        category, _ = SiteCategory.objects.get_or_create(
            slug='general',
            defaults={'name': 'General'}
        )
        template, _ = Template.objects.get_or_create(
            slug='default',
            defaults={
                'name': 'Default Template',
                'category': category,
                'source_identifier': 'default'
            }
        )
        from django.utils.text import slugify
        
        site, _ = Site.objects.get_or_create(
            owner=user,
            defaults={
                'name': getattr(user, 'restaurant_name', '') or f"Site for {user.phone_number}",
                'slug': slugify(getattr(user, 'restaurant_name', '') or f"site-{user.phone_number}", allow_unicode=True),
                'category': category,
                'template': template,
                'settings': template.default_settings
            }
        )
        return site

    def __str__(self):
        return f"{self.name} - {self.owner.phone_number}"
