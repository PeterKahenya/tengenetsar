from django.shortcuts import render
from .models import Expert
from calls.models import Call
from django.views import View

class ExpertCallingPage(View):
	def get(self,request):
		if request.user.is_authenticated:
			expert=Expert.objects.filter(user=request.user).first()
			if expert:
				return render(request,"expert_calling_page.html",{'expert':expert},None,None,None)
			else:
				return redirect('/login')
		else:
			return redirect('/login')

class ExpertCallsList(View):
    def get(self,request):
        if request.user.is_authenticated:
            expert=Expert.objects.filter(user=request.user).first()
            if expert:
                calls=Call.objects.filter(expert=expert)
                return render(request,"expert_calls_list_page.html",{'expert':expert,"calls":calls},None,None,None)
            else:
                return redirect('/login')
        else:
            return redirect('/login')