from shop.models import *
from rest_framework.authentication import SessionAuthentication, BasicAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from ..serializers.orders import OrderItemSerializer

class CreateSharedLink(APIView):
	authentication_classes = [TokenAuthentication]
	permission_classes = [IsAuthenticated]

	def post(self,request,format=None):
		order_items = json.loads(request.data.get("cart")).get("order_items")
		shared = Shared()
		shared.added_by=request.user
		shared.save()


		for order_item in order_items:
			p=Product.objects.get(id=order_item.get("product").get("id"))
			print(p)
			print(order_item.get("quantity"))
			new_oi=OrderItem()
			new_oi.product = Product.objects.get(id=order_item.get("product").get("id"))
			new_oi.quantity=int(order_item.get("quantity"))
			new_oi.save()
			print(new_oi)
			shared.order_items.add(new_oi)

		shared.save()
		print(shared)

		return Response({"status":"success","shareable_link":"?sharedcart="+str(shared.id)})

class GetSharedCart(APIView):
	authentication_classes = [TokenAuthentication]
	permission_classes = [IsAuthenticated]

	def post(self,request,format=None):
		print(request.data)
		sharedcart_id = request.data.get("sharedcart")
		shared = Shared.objects.get(id=sharedcart_id)
		shared.checkout_by=request.user
		shared.save()
		serializer=OrderItemSerializer(shared.order_items.all(),many=True)

		if shared:
			return Response({"status":"success","shared_items":serializer.data})
		else:
			return Response({"status":"failed"})
