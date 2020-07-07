import json
from django.shortcuts import render,redirect
from .models import Expert
from calls.models import Call
from django.views import View
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse


class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    email = forms.EmailField(max_length=254, help_text='Required. Input a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )


def expert_signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            u = authenticate(username=username, password=raw_password)
            expert=Expert()
            expert.user=u
            expert.save()
            login(request, u)
            return redirect('/expert')
        else:
            return render(request, 'registration/e_signup.html',{'form':form})
    else:
        form = SignUpForm()
        return render(request, 'registration/e_signup.html',{'form':form})


def expert_login(request):
    if request.method=="GET":
        return render(request,"registration/e_login.html")
    else:
        username=request.POST.get('username')
        password=request.POST.get('password')

        user = authenticate(username=username, password=password)
        if Expert.objects.filter(user=user).first():
            login(request, user)
            return redirect('/expert')
        else:
            return render(request,"registration/e_login.html",{'errors': "invalid credentials"})

class ExpertCallingPage(View):
	def get(self,request,room):
		if request.user.is_authenticated:
			expert=Expert.objects.filter(user=request.user).first()
			if expert:
				return render(request,"expert/expert_calling_page.html",{'expert':expert,"room_id":room},None,None,None)
			else:
				return redirect('/expert/login')
		else:
			return redirect('/expert/login')

class ExpertHome(View):
    def get(self,request):
        if request.user.is_authenticated:
            expert=Expert.objects.filter(user=request.user).first()
            if expert:
                calls=Call.objects.filter(expert=expert)
                return render(request,"expert/expert_home.html",{'expert':expert,"calls":calls},None,None,None)
            else:
                return redirect('/expert/login')
        else:
            return redirect('/expert/login')

@method_decorator(csrf_exempt, name='dispatch')
class ExpertLock(View):
	def post(self,request):
		data=json.loads(request.body.decode('utf-8'))
		expert=Expert.objects.get(id=data['expert_id'])
		expert.is_free=data['status']
		expert.save()
		return JsonResponse({"status":data['status']})


@method_decorator(csrf_exempt, name='dispatch')
class AddToken(View):
    def post(self, request):
        data=json.loads(request.body.decode('utf-8'))
        expert=Expert.objects.filter(user=request.user).first()
        if expert:
            expert.gcm_token=data['token']
            expert.save()
            return JsonResponse({"token_added":True})
        else:
            return JsonResponse({"token_added":False})