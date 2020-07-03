from django.urls import path,include,re_path
from .views import ExpertCallingPage,ExpertCallsList
urlpatterns = [
    path('',ExpertCallsList.as_view()),
    path('call',ExpertCallingPage.as_view())
]