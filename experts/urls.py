from django.urls import path,include,re_path
from .views import ExpertCallingPage,ExpertCallsList,expert_login,expert_signup,ExpertLock
urlpatterns = [
    path('',ExpertCallsList.as_view()),
    path('call',ExpertCallingPage.as_view()),
    path('login',expert_login,name='expert-login'),
    path('signup',expert_signup,name='expert-signup'),
    path('lock',ExpertLock.as_view(),name='expert-lock')
]