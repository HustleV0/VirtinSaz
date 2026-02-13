from sites.models import Plugin, SitePlugin, Site
print(f'Sites: {Site.objects.count()}')
print(f'Plugins: {Plugin.objects.count()}')
print(f'SitePlugins: {SitePlugin.objects.count()}')
for sp in SitePlugin.objects.all():
    print(f'Site: {sp.site.name}, Plugin: {sp.plugin.key}, Active: {sp.is_active}')
