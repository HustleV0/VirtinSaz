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
    DebugSlugsView
)

urlpatterns = [
    path('site-categories/', SiteCategoryListView.as_view(), name='category-list'),
    path('plugins/', PluginListView.as_view(), name='plugin-list'),
    path('themes/', ThemeListView.as_view(), name='theme-list'),
    path('themes/<int:pk>/', ThemeDetailView.as_view(), name='theme-detail'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('user-sites/', UserSiteListView.as_view(), name='user-sites'),
    path('site/me/', SiteMeView.as_view(), name='site-me'),
    path('site/active-plugins/', SiteActivePluginsView.as_view(), name='site-active-plugins'),
    path('site/toggle-plugin/', SitePluginToggleView.as_view(), name='site-toggle-plugin'),
    path('site/create/', SiteCreateView.as_view(), name='site-create'),
    path('site/settings/', SiteSettingsUpdateView.as_view(), name='site-settings-update'),
    path('debug-slugs/', DebugSlugsView.as_view(), name='debug-slugs'),
    re_path(r'^site/public/(?P<slug>[^/]+)/$', SitePublicView.as_view(), name='site-public'),
]
