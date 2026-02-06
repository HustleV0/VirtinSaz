from django.urls import path, re_path
from .views import (
    SiteCategoryListView, 
    ThemeListView, 
    ThemeDetailView,
    SignupView, 
    SiteMeView, 
    SiteCreateView,
    SiteSettingsUpdateView,
    SitePublicView,
    DebugSlugsView
)

urlpatterns = [
    path('site-categories/', SiteCategoryListView.as_view(), name='category-list'),
    path('themes/', ThemeListView.as_view(), name='theme-list'),
    path('themes/<int:pk>/', ThemeDetailView.as_view(), name='theme-detail'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('site/me/', SiteMeView.as_view(), name='site-me'),
    path('site/create/', SiteCreateView.as_view(), name='site-create'),
    path('site/settings/', SiteSettingsUpdateView.as_view(), name='site-settings-update'),
    path('debug-slugs/', DebugSlugsView.as_view(), name='debug-slugs'),
    re_path(r'^site/public/(?P<slug>[^/]+)/$', SitePublicView.as_view(), name='site-public'),
]
