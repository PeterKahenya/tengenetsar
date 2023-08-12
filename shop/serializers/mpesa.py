from rest_framework import serializers
from .orders import DeliverySerializer
from ..models import MPESAPayment

class MPESAPaymentSerializer(serializers.ModelSerializer):
    deliveries = DeliverySerializer(many=True, read_only=True)
    class Meta:
        model = MPESAPayment
        fields = ['id','code','amount','account_no','payment_method','payment_by','deliveries','created_at','updated_at']
