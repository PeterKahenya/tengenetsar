from django.shortcuts import render,redirect
from django.views import View
from .models import Caller
from experts.models import Expert

class CallView(View):
	def get(self,request):
		if request.user.is_authenticated:
			caller=Caller.objects.filter(user=request.user).first()
			if caller:
				expert=Expert.objects.filter(is_free=True).first()
				return render(request,"calling_page.html",{'caller':caller,'expert':expert},None,None,None)
			else:
				return redirect("/login")
		else:
			return redirect("/login")
class CallView(View):
    def get(self, request):
        return render(request,"caller/calling_page.html",None,None,None,None)

class CallerHome(View):
    def get(self, request):
        return render(request,"caller/caller_home.html",None,None,None,None)

    
    