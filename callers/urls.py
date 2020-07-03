from django.urls import path,include,re_path
from .views import CallView,CallerHome,caller_signup,caller_login

urlpatterns = [
    path('',CallerHome.as_view()),
    path('call',CallView.as_view()),
    path('login',caller_login),
    path('signup',caller_signup)
]