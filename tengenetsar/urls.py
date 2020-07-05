from django.contrib import admin
from django.urls import path,include,re_path
from .home import *

urlpatterns = [
    path('',HomeView.as_view(),name='homepage'),
    path('caller/',include('callers.urls')),
    path('expert/',include('experts.urls')),
    path('calls/',include('calls.urls')),
    path('shop/',include('shop.urls')),
    re_path('^serviceworker.js$', service_worker),
    re_path('^manifest.json$', manifest),
    path('comingsoon/', ComingSoon.as_view()),
    path('admin/', admin.site.urls),
]
