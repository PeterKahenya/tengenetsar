from django.views import View
from django.shortcuts import render
from rest_framework.authentication import SessionAuthentication, BasicAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework import serializers
import os
from django.http import HttpResponse
from . import settings

class UserSerializer(serializers.ModelSerializer):
	"""docstring for UserSerializer"""
	class Meta:
		model= User
		fields = ["username","email","first_name","last_name"]
		
class HomeView(View):
    def get(self,request):
        return render(request,"home.html")

class GetUserDetails(APIView):
	authentication_classes = [TokenAuthentication]
	permission_classes = [IsAuthenticated]
	def get(self,request,format=None):
		serializer = UserSerializer(request.user)
		return Response(serializer.data)


def service_worker(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/sw.js")).read(), content_type='application/javascript')
    return response
    
def firebase_messaging_sw(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/firebase-messaging-sw.js")).read(), content_type='application/javascript')
    return response

def manifest(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/manifest.json")).read(), content_type='application/json')
    return response