from django.views import View
from django.shortcuts import render

class HomeView(View):
    def get(self, request):
        return render(request,"home.html",None,None,None,None)