from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from .models import Delivery
from .models import Shared


class ShopView(View):
	def get(self,request):
		return render(request,"shop.html")

			
		