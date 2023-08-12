from django.views import View
from django.shortcuts import render

class HelpView(View):
    def get(self,request):
        return render(request,"help.html")