from django.shortcuts import render,redirect
from django.views import View
from .models import Caller
from fundi.models import Fundi

class CallView(View):
	def get(self,request):
		if request.user.is_authenticated:
			caller=Caller.objects.filter(user=request.user).first()
			if caller:
				fundi=Fundi.objects.filter(is_free=True).first()
				return render(request,"caller_calling_page.html",{'caller':caller,'fundi':fundi},None,None,None)
			else:
				return redirect("/login")
		else:
			return redirect("/login")
