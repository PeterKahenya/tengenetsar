from django.views import View
from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json

from fundi.models import Fundi


class FundiStandbyCall(View):
	def get(self,request):
		if request.user.is_authenticated:
			fundi=Fundi.objects.filter(user=request.user).first()
			if fundi:
				return render(request,"fundi_standby_call_page.html",{'fundi':fundi},None,None,None)
			else:
				return redirect('/f_login')
		else:
			return redirect('/f_login')

class FundiStandbyCallNotification(View):
	def get(self,request):
		if request.user.is_authenticated:
			fundi=Fundi.objects.filter(user=request.user).first()
			if fundi:
				return render(request,"fundi_standby_call_page_notification.html",{'fundi':fundi},None,None,None)
			else:
				return redirect('/f_login')
		else:
			return redirect('/f_login')


@method_decorator(csrf_exempt, name='dispatch')
class FundiLock(View):
	def post(self,request):
		data=json.loads(request.body.decode('utf-8'))
		fundi=Fundi.objects.get(id=data['fundi_id'])
		fundi.is_free=data['status']
		fundi.save()
		return JsonResponse({"status":data['status']})
		
		

