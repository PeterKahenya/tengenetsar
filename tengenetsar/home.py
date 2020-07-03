import os
from django.views import View
from django.shortcuts import render
from django.http import HttpResponse

from . import settings

def service_worker(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/sw.js")).read(), content_type='application/javascript')
    return response


def manifest(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/manifest.json")).read(), content_type='application/json')
    return response

class HomeView(View):
    def get(self, request):
        return render(request,"home.html",None,None,None,None)