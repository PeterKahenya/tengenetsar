from django.contrib import admin
from django.urls import path,include,re_path
from .home import *

urlpatterns = [
    path('',HomeView.as_view(),name='homepage'),
    re_path('^serviceworker.js$', service_worker),
    re_path('^manifest.json$', manifest),
    path('admin/', admin.site.urls),
]
