from django.urls import path,re_path,include
from .viewsets import *

urlpatterns=[
    path("start_call",APICallView.as_view()),
    path("chats",APIChatList.as_view()),
    path("history",APICallHistory.as_view()),
]