from django.shortcuts import render
from django.views import View
from .models import Call
from django.http import HttpResponseNotFound


class CallView(View):

	"""
		This is the callview. This view renders the call page by extracting the room from the ?callID= field of the url
		The call then uses the room as the document id for the webrtc firebase app rendered
	"""

	def start_call(self,request,call):
		return render(request,"index.html",{'call':call,'utype':'caller'},None,None,None)

	def answer(self,request,call):
		call.callee_accepted = True
		call.save()
		return render(request,"index.html",{'call':call,'utype':'callee'},None,None,None)

		
	
	def get(self,request):
		room_id = request.GET.get("r")
		print(room_id)
		if room_id:
			call= Call()
			call.room=room_id
			call.save()
			utype = request.GET.get("ut")
			if utype == "caller":
				return self.start_call(request,call)
			elif utype == "callee":
				return self.answer(request,call)
			else:
				"""utype is not recognized"""
				print("utype is not recognized")
				return HttpResponseNotFound("utype is not recognized")
		else:
			"""Room ID not specified"""
			print("Room ID not specified")
			return HttpResponseNotFound("Room ID not specified")

from django.shortcuts import render
from django.views import View
from .models import Call
from django.http import HttpResponseNotFound


class APICallView(View):

	"""
		This is the callview. This view renders the call page by extracting the room from the ?callID= field of the url
		The call then uses the room as the document id for the webrtc firebase app rendered
	"""

	def start_call(self,request,call):
		return render(request,"index.html",{'call':call,'utype':'caller'},None,None,None)

	def answer(self,request,call):
		call.callee_accepted = True
		call.save()
		return render(request,"index.html",{'call':call,'utype':'callee'},None,None,None)

		
	
	def get(self,request):
		room_id = request.GET.get("r")
		print(room_id)
		if room_id:
			call= Call()
			call.room=room_id
			call.save()
			utype = request.GET.get("ut")
			if utype == "caller":
				return self.start_call(request,call)
			elif utype == "callee":
				return self.answer(request,call)
			else:
				"""utype is not recognized"""
				print("utype is not recognized")
				return HttpResponseNotFound("utype is not recognized")
		else:
			"""Room ID not specified"""
			print("Room ID not specified")
			return HttpResponseNotFound("Room ID not specified")



		