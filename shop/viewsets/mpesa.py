from rest_framework.authentication import SessionAuthentication, BasicAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from shop.serializers.mpesa import MPESAPaymentSerializer
from shop.models import MPESAPayment,Delivery
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class AddMPESAPaymentView(APIView):
    def post(self, request, format=None):
        try:
            payment = MPESAPayment()
            payment.code=request.data.get("code")
            payment.amount=Decimal(request.data.get("amount"))
            payment.account_no=request.data.get("account_no")
            payment.payment_by=request.data.get("payment_by")
            payment.payment_method = "MPESA"
            payment.save()

            serializer = MPESAPaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class CheckMPESAPaymentView(APIView):
    def post(self, request, format=None):
        print(request.data)
        payment=MPESAPayment.objects.filter(code=request.data.get("code")).first()
        print("payment"+str(payment))
        if payment and not Delivery.objects.filter(mpesa_payment=payment).first():
            print(payment)
            serializer = MPESAPaymentSerializer(payment)
            return Response(serializer.data)
        return Response({"NF":True,"message":"No such payment. Please check the code and try again!"})
