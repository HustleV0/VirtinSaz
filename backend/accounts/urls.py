from django.urls import path, re_path
from .views import RegisterView, LoginView, ProfileView

urlpatterns = [
    re_path(r'^register/?$', RegisterView.as_view(), name='register'),
    re_path(r'^login/?$', LoginView.as_view(), name='login'),
    re_path(r'^profile/?$', ProfileView.as_view(), name='profile'),
]
