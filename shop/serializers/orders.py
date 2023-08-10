from rest_framework import serializers
from ..models import OrderItem,Order,ShippingAddress,Delivery

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'

class ShippingAddressSerializer(serializers.ModelSerializer):
    delivery = DeliverySerializer(many=True, read_only=True)

    class Meta:
        model = ShippingAddress
        fields = ['id','order','full_name','county','city','longitude','latitude','delivery','created_at','updated_at']
        
class OrderSerializer(serializers.ModelSerializer):
    shipping_addresses = ShippingAddressSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id','added_by','checkout_by','order_items','total_price','shipping_addresses','created_at','updated_at']
        depth=1  


class OrderItemSerializer(serializers.ModelSerializer):
    orders = OrderSerializer(many=True, read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id','product','orders','quantity','created_at','updated_at']
        depth=1  

        

