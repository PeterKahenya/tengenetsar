from django.urls import path,include,re_path
from .views import CallView,CallerHome

urlpatterns = [
    path('',CallerHome.as_view()),
    path('call',CallView.as_view())
]