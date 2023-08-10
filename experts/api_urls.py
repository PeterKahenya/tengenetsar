from django.urls import path,re_path,include
from .viewsets import *


urlpatterns = [
    path('',ExpertsListView.as_view()),
    path('signup',ExpertSignUpView.as_view()),
    path('get_auth_token',GetOrGenerateToken.as_view())
]