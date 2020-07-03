from django.contrib import admin
from django.urls import path
from .home import *

urlpatterns = [
    path('',HomeView.as_view(),name='homepage'),
    path('admin/', admin.site.urls),
]
