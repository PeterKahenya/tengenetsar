from rest_framework.views import APIView
from .models import Expert
from django.contrib.auth.models import User
from .serializers import ExpertSerializer 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.db.utils import IntegrityError

class GetOrGenerateToken(APIView):
    def post(self, request,format=None):
        username=request.data.get('username')
        password=request.data.get('password')

        try:
            user = User.objects.filter(username=username,password=password).first()
            expert = Expert.objects.filter(user=user).first()
            token,created = Token.objects.get_or_create(user=user)
        
        except Exception as e:
            return Response({'message':str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            es=ExpertSerializer(expert)
            return Response({'success':True,"expert":es.data,"token":token.key})


class ExpertSignUpView(APIView):
    def post(self, request,format=None):
        print(request.data)
        first_name= request.data.get('first_name')
        # last_name= request.data.get('last_name')
        username= request.data.get('email')
        email = request.data.get('email')
        password= request.data.get('password')
        specialty= request.data.get('specialty')
        fcm_token = request.data.get('gcm_token')
        
        try:
            if User.objects.filter(username=username).exists():
                return Response({'message':"Account already exists."})
            user = User.objects.create_user(username,email,password)
            user.first_name = first_name
            # user.last_name = last_name
            user.save()
            
            expert = Expert.objects.create(user=user)
            expert.specialty = specialty
            expert.gcm_token = fcm_token
            expert.phone_number = request.data.get('phone_number')
            expert.save()
            token = Token.objects.create(user=user)
        except Exception as e:
            return Response({'message':"Integrity Error,"+str(e)})
        else:
            es=ExpertSerializer(expert)
            return Response({'success':True,"user":es.data,"token":token.key},status=status.HTTP_201_CREATED)


class ExpertsListView(APIView):
    def get(self,request,format=None):
        experts=Expert.objects.all()
        es=ExpertSerializer(experts,many=True)
        return Response(es.data)
        