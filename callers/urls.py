from django.urls import path,include,re_path
from .views import CallView,CallerHome,caller_signup,caller_login,ProfileView
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('',CallerHome.as_view()),
    path('call',CallView.as_view()),
    path('profile',ProfileView.as_view()),
    path('login',caller_login),
    path('signup',caller_signup),
    path("logout/",LogoutView.as_view(), name='caller-logout'),
]