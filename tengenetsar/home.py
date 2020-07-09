from django.shortcuts import render
from django.views import View
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
import os
from django.http import HttpResponse
from experts.models import Expert
from . import settings


def service_worker(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/sw.js")).read(), content_type='application/javascript')
    return response
def firebase_messaging_sw(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/firebase-messaging-sw.js")).read(), content_type='application/javascript')
    return response

def manifest(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/manifest.json")).read(), content_type='application/json')
    return response



class HomeView(View):
    def get(self, request):
        if request.user.is_authenticated:
            expert=Expert.objects.filter(user=request.user).first()
            if expert:
                return redirect("/expert")
            else:
                return redirect("/caller")
        else:
            return render(request,"home.html",None,None,None,None)


class ComingSoon(View):
	def get(self,request):
		return render(request,"comingsoon.html",None,None,None,None)
