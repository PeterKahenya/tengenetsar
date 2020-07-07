from django.urls import path,include,re_path
from .views import AddChat,SendRoom
urlpatterns = [
    path('chats/add',AddChat.as_view()),
    path('sendroom',SendRoom.as_view())
]