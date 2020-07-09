from django.shortcuts import render, redirect
from django.views import View
from .models import Caller
from experts.models import Expert
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from calls.models import Call


class SignUpForm(UserCreationForm):
    first_name = forms.CharField(
        max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(
        max_length=30, required=False, help_text='Optional.')
    email = forms.EmailField(
        max_length=254, help_text='Required. Input a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name',
                  'email', 'password1', 'password2', )
    

def caller_signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            caller = Caller()
            caller.user = user
            caller.save()
            login(request, user)
            return redirect('/caller/')
        else:
            return render(request, 'registration/c_signup.html', {'form': form})
    else:
        form = SignUpForm()
        return render(request, 'registration/c_signup.html', {'form': form})


def caller_login(request):
    if request.method == "GET":
        return render(request, "registration/c_login.html")
    else:
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)
        if Caller.objects.filter(user=user).first():
            login(request, user)
            return redirect('/caller/')
        else:
            return render(request, "registration/c_login.html", {'errors': "invalid credentials"})


class CallView(View):
    def get(self, request):
        if request.user.is_authenticated:
            caller = Caller.objects.filter(user=request.user).first()
            if caller:
                expert = Expert.objects.get(id=request.GET.get('expert'))
                if expert:
                    call = Call()
                    call.caller=caller
                    call.expert=expert
                    call.save()
                    return render(request, "caller/calling_page.html", {'call': call}, None, None, None)
                else:
                    calls = Call.objects.filter(caller=caller)
                    return render(request, "caller/caller_home.html", {"caller": caller, "calls": calls, "message": "Our Fix team is fully occupied at the moment. Please try again in a few minutes!"}, None, None, None)
            else:
                    return redirect("/caller/login")
        else:
            return redirect("/caller/login")


class CallerHome(View):
    def get(self, request):
        if request.user.is_authenticated:
            caller = Caller.objects.filter(user=request.user).first()
            if caller:
                raw_calls = Call.objects.filter(caller=caller)
                calls = []
                for raw_call in raw_calls:
                    call={}
                    call["caller"]=raw_call.caller
                    call["id"]=raw_call.id
                    call["expert"]=raw_call.expert
                    call["created"]=raw_call.created
                    call["last_chat"]=raw_call.chat.last()
                    calls.append(call)
                experts = Expert.objects.all()
                return render(request, "caller/caller_home.html", {"caller": caller, "calls": calls,"experts":experts}, None, None, None)
            else:
                return redirect("/caller/login")
        else:
            return redirect("/caller/login")
