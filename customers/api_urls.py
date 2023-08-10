from django.urls import path,re_path,include
from .viewsets import *


urlpatterns = [
    path('signup',CustomerSignUpView.as_view()),
    path('get_auth_token',GetOrGenerateToken.as_view())
]