from django.urls import path,include,re_path
from .views import AddChat
urlpatterns = [
    path('chats/add',AddChat.as_view())
]