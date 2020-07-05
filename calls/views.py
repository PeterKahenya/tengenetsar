from django.shortcuts import render
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from callers.models import Caller
from experts.models import Expert
from .models import Call,Chat
from django.contrib.auth.models import User
import json

@method_decorator(csrf_exempt, name='dispatch')
class AddChat(View):
    def post(self,request):
        data=json.loads(request.body.decode('utf-8'))
        print(str(data))
        sender_id = data['sender_id']
        call = Call.objects.get(id=data['call_id'])
        text = data['text']
        sender=None
        
        expert=Expert.objects.get(id=data['sender_id'])
        if expert:
            sender=Expert.objects.get(id=data['sender_id']).user
        else:
            sender=Caller.objects.get(id=data['sender_id']).user

        chat=Chat()
        chat.call=call
        chat.sender=sender
        chat.text=text
        chat.save()
        
        return JsonResponse({"chat_added":True})
