from django.views import View
from django.shortcuts import render

class TermsView(View):
    def get(self,request):
        return render(request,"terms.html")