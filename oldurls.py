from django.contrib import admin
from django.urls import path,include,re_path
from .home import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',HomeView.as_view(),name='homepage'),
    path('caller/',include('callers.urls')),
    path('expert/',include('experts.urls')),
    path('calls/',include('calls.urls')),
    path('shop/',include('shop.urls')),
    path('terms/',Terms.as_view()),
    path('help/',Help.as_view()),
    re_path('^serviceworker.js$', service_worker),
    re_path('^firebase-messaging-sw.js$', firebase_messaging_sw),
    re_path('^manifest.json$', manifest),
    path('comingsoon/', ComingSoon.as_view()),
    path('admin/', admin.site.urls),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

