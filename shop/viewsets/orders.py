from shop.models import *
from shop.serializers.orders import *
from rest_framework.authentication import SessionAuthentication, BasicAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from ..generate_docs import generate_and_send
import json

class ShippingAddressView(APIView):

    """
    
    Get shipping addresses and Create a shipping address
    
    """
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        addresses = ShippingAddress.objects.filter(owner=request.user)
        serializer = ShippingAddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        print(request.data)
        address = ShippingAddress()

        address.owner = request.user
        address.full_name = request.data.get("full_name")
        address.phone = request.data.get("phone")
        address.county = request.data.get("county")
        address.city = request.data.get("city")
        address.longitude = request.data.get("longitude")
        address.latitude = request.data.get("latitude")
        address.description = request.data.get("description")

        address.save()

        serializer = ShippingAddressSerializer(address)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CheckoutView(APIView):
    
    """
        
        Get your cart and checkout
    
    """
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        cart,created = Order.objects.get_or_create(added_by=request.user)
        serializer = OrderSerializer(cart)
        return Response(serializer.data)

    def post(self, request, format=None):
        print(request.data)
        cart,created = Order.objects.get_or_create(added_by=request.user)
        print(cart,created)
        order_items = json.loads(request.data.get("cart")).get("order_items")
        print(order_items)
        cart.order_items.all().delete()
        print(cart)

        
        for order_item in order_items:
            cart.update(order_item)


        print(cart)

        shipping_address = ShippingAddress.objects.get(id=request.data.get("shipping_address_id"))
        shipping_address.order=cart
        shipping_address.save()

        payment = MPESAPayment.objects.get(id=request.data.get("mpesa_payment_id"))
        cart.completed=True
        cart.checkout_by = request.user
        cart.save()

        status = generate_and_send(shipping_address,request,payment)
        print(status)
        if status:
            delivery=Delivery(address=shipping_address,mpesa_payment=payment)
            delivery.save()
            serializer = DeliverySerializer(delivery)
            return Response(serializer.data)
        else:
            return Response({"message":"Insufficient Funds"})


class CartView(APIView):
    """

        Adding an item to cart or removing or changing the quantity

    """
    
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        cart,created = Order.objects.get_or_create(added_by=request.user)
        serializer = OrderSerializer(cart)
        return Response(serializer.data)

    def post(self, request, format=None):
        cart,created = Order.objects.get_or_create(added_by=request.user)
        print(request.data)
        # product_id = request.data.get("product").get("id")
        # product = Product.objects.get(pk=product_id)
        # order_item = cart.get_or_create_order_item(product=product)
        # updated_quantity = request.data.get("quantity")
        # order_item=cart.update_quantity(order_item,updated_quantity)
        serializer = OrderSerializer(cart)
        return Response(serializer.data)