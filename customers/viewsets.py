from rest_framework.views import APIView
from .models import Customer
from django.contrib.auth.models import User
from .serializers import CustomerSerializer 
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
            customer = Customer.objects.filter(user=user).first()
            token,created = Token.objects.get_or_create(user=user)
        
        except Exception as e:
            return Response({'message':str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            cs=CustomerSerializer(customer)
            return Response({'success':True,"customer":cs.data,"token":token.key})


class CustomerSignUpView(APIView):
    def post(self, request,format=None):
        first_name=request.data.get('first_name')
        # last_name=request.data.get('last_name')
        username=request.data.get('email')
        email = request.data.get('email')
        password=request.data.get('password')+"@WalkingLight2020"
        
        try:
            if User.objects.filter(username=username).exists():
                return Response({'message':"Account already exists."})
            user = User.objects.create_user(username,email,password)


            user.first_name = first_name
            # user.last_name = last_name
            user.save()
            
            customer = Customer.objects.create(user=user)
            customer.gcm_token = request.data.get('gcm_token')
            customer.phone_number = request.data.get('phone_number')

            customer.save()
            token = Token.objects.create(user=user)
        except Exception as e:
            print(e)
            return Response({'message':"Integrity Error,"+str(e)})
        else:
            cs=CustomerSerializer(customer)
            return Response({'success':True,"user":cs.data,"token":token.key},status=status.HTTP_201_CREATED)
 


        