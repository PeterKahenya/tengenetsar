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
import requests


def sendPush(to,roomId):
    url = 'https://fcm.googleapis.com/fcm/send'
    json_data = {
        "to": to,
        "data":{
            "title":"Tengeneza Call Request",
            "room_id":roomId,
        },
    }
    headers = {
        "Authorization":"key=AAAAOGOy1tc:APA91bH41zurNt10opqsUz66eNl79KlHgXDNDyiZ4Hzm7pwpmdvk2xz2tHjzQWQ4mPqeEDzldQkjVRJT8IR7eM-y8TNgrgTLMvbl4kTj92AP0Tnq0BF1xQbDuVaXrdqkwyiBHdQBfDjT",
        "Content-Type":"application/json"
    }

    x = requests.post(url, json = json_data, headers=headers)



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

@method_decorator(csrf_exempt, name='dispatch')
class SendRoom(View):
    def post(self,request):
        data=json.loads(request.body.decode('utf-8'))
        room_id=data["room_id"]
        expert=Expert.objects.get(id=data["expert_id"])
        print(room_id)
        if expert:
            sendPush(expert.gcm_token,room_id)
            return JsonResponse({"call_initiated":True})
        else:
            return JsonResponse({"call_initiated":False})
            


