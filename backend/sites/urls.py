from django.urls import path, re_path
from .views import (
    SiteCategoryListView, 
    ThemeListView, 
    ThemeDetailView,
    PluginListView,
    SignupView, 
    UserSiteListView,
    SiteMeView, 
    SiteCreateView,
    SiteSettingsUpdateView,
    SitePublicView,
    SiteActivePluginsView,
    SitePluginToggleView,
    DebugSlugsView,
    SiteSitemapListView,
    SubdomainAvailabilityView,
    SiteCreationProgressView
)

urlpatterns = [
    re_path(r'^site-categories/?$', SiteCategoryListView.as_view(), name='category-list'),
    re_path(r'^plugins/?$', PluginListView.as_view(), name='plugin-list'),
    re_path(r'^themes/?$', ThemeListView.as_view(), name='theme-list'),
    re_path(r'^themes/(?P<pk>\d+)/?$', ThemeDetailView.as_view(), name='theme-detail'),
    re_path(r'^signup/?$', SignupView.as_view(), name='signup'),
    re_path(r'^user-sites/?$', UserSiteListView.as_view(), name='user-sites'),
    re_path(r'^site/me/?$', SiteMeView.as_view(), name='site-me'),
    re_path(r'^site/active-plugins/?$', SiteActivePluginsView.as_view(), name='site-active-plugins'),
    re_path(r'^site/toggle-plugin/?$', SitePluginToggleView.as_view(), name='site-toggle-plugin'),
    re_path(r'^site/create/?$', SiteCreateView.as_view(), name='site-create'),
    re_path(r'^site/settings/?$', SiteSettingsUpdateView.as_view(), name='site-settings-update'),
    re_path(r'^site/sitemap/?$', SiteSitemapListView.as_view(), name='site-sitemap'),
    re_path(r'^check-subdomain/?$', SubdomainAvailabilityView.as_view(), name='check-subdomain'),
    re_path(r'^creation-progress/?$', SiteCreationProgressView.as_view(), name='creation-progress'),
    re_path(r'^debug-slugs/?$', DebugSlugsView.as_view(), name='debug-slugs'),
    re_path(r'^site/public/(?P<slug>[^/]+)/?$', SitePublicView.as_view(), name='site-public'),
]
