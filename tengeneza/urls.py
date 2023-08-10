from django.contrib import admin
from django.urls import path,include,re_path
from caller.views import CallView
from fundi.views import FundiStandbyCall,FundiLock,FundiStandbyCallNotification
from .home import *
from django.contrib.auth.views import LoginView,LogoutView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
	path('',HomeView.as_view()),
	re_path('^serviceworker.js$', service_worker),
    re_path('^manifest.json$', manifest),
	path("login/",caller_login, name='caller_login'),
    path("signup/",caller_signup, name='caller_signup'),
    path('call/',CallView.as_view(),name="caller_page"),

	path("f_login/",fundi_login, name='f_login'),
    path("f_signup/",fundi_signup, name='f_signup'),
    path('fundi/',FundiStandbyCall.as_view(),name="fundi-page"),
    path('fundi_n/',FundiStandbyCallNotification.as_view(),name="fundi-page-n"),

    path('fundi/lock',FundiLock.as_view(),name="fundi-lock"),

    path("logout/",LogoutView.as_view(), name='logout'),

    path('admin/', admin.site.urls),
    path('shop/',include('shop.urls'))
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
