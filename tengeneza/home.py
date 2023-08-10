from django.shortcuts import render
from django.views import View
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django import forms
from django.contrib.auth.models import User
from fundi.models import Fundi
from caller.models import Caller
import os
from django.http import HttpResponse

from . import settings


def service_worker(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/sw.js")).read(), content_type='application/javascript')
    return response


def manifest(request):
    response = HttpResponse(open(os.path.join(settings.BASE_DIR,"static/pwa/manifest.json")).read(), content_type='application/json')
    return response



class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    email = forms.EmailField(max_length=254, help_text='Required. Input a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )

def caller_signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            caller=Caller()
            caller.user=user
            caller.save()
            login(request, user)
            return redirect('/call')
        else:
            return render(request, 'registration/signup.html',{'form':form})
    else:
        form = SignUpForm()
        return render(request, 'registration/signup.html',{'form':form})



def fundi_signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            u = authenticate(username=username, password=raw_password)
            fundi=Fundi()
            fundi.user=u
            fundi.save()
            login(request, u)
            return redirect('/fundi')
        else:
            return render(request, 'registration/f_signup.html',{'form':form})
    else:
        form = SignUpForm()
        return render(request, 'registration/f_signup.html',{'form':form})


def fundi_login(request):
    if request.method=="GET":
        return render(request,"registration/f_login.html")
    else:
        username=request.POST.get('username')
        password=request.POST.get('password')

        user = authenticate(username=username, password=password)
        if Fundi.objects.filter(user=user).first():
            login(request, user)
            return redirect('/fundi')
        else:
            return render(request,"registration/f_login.html",{'errors': "invalid credentials"})
def caller_login(request):
    if request.method=="GET":
        return render(request,"registration/login.html")
    else:
        username=request.POST.get('username')
        password=request.POST.get('password')

        user = authenticate(username=username, password=password)
        if Caller.objects.filter(user=user).first():
            login(request, user)
            return redirect('/call')
        else:
            return render(request,"registration/login.html",{'errors': "invalid credentials"})


class HomeView(View):
	def get(self,request):
		return render(request,"index.html",None,None,None,None)
