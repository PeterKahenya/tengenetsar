from django.views import View
from django.shortcuts import render

class CleanView(View):
    def get(self,request):
        return render(request,"clean.html")