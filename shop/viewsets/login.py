from customers.models import Customer
from experts.models import Expert
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from experts.serializers import ExpertSerializer
from customers.serializers import CustomerSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate,login

class TengenetsarLoginView(APIView):
    def post(self, request,format=None):
        print(request.data)
        email = request.data.get('email')
        password=request.data.get('password')+"@WalkingLight2020"

        print(password)
        user = authenticate(username=email,password=password)

        print(user)
        if not user:
            return Response({'success':False})


        tengenetsar_user=None
        serializer=None

        customer=Customer.objects.filter(user=user).first()
        expert=Expert.objects.filter(user=user).first()

        print(customer)
        print(expert)

        
        if expert:
            tengenetsar_user=expert
            serializer = ExpertSerializer(expert)
            print('tengenetsar_user is an expert')
        elif customer:
            tengenetsar_user=customer
            serializer = CustomerSerializer(customer)
            print('tengenetsar_user is an customer')

        else:
            print('tengenetsar_user is an not a customer or expert')

            return Response({'success':False})
        
        if tengenetsar_user:
            print('tengenetsar_user exists')

            token,created = Token.objects.get_or_create(user=user)
            tengenetsar_user.gcm_token = request.data.get('gcm_token')
            tengenetsar_user.save()
            return Response({'token':token.key,'success':True,'user':serializer.data})
        else:
            return Response({'success':False})
            
