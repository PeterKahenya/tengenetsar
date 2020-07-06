from django.shortcuts import render,redirect
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import locale
from .models import Product, Order,Category


class ProductsListView(ListView):
    model = Product
    template_name = "shop/index.html"

    def get_context_data(self, **kwargs):
        user=self.request.user
        context = super().get_context_data(**kwargs)
        context['products'] = Product.objects.all()
        context['categories'] = Category.objects.all()


        order = Order.objects.filter(user=user, is_fullfield=False).first()
        if not order:
            order = Order()
            order.user = user
            order.is_fullfield = False
            order.save()
            
        context['order_products'] = order.products.all()
        return context

class ProductDetailView(DetailView):
    model = Product
    template_name = "shop/product.html"

    def get_context_data(self, **kwargs):
        user=self.request.user
        context = super().get_context_data(**kwargs)
        context['products'] = Product.objects.all()
        
        order = Order.objects.filter(user=user, is_fullfield=False).first()
        if not order:
            order = Order()
            order.user = user
            order.is_fullfield = False
            order.save()

        context['order_products'] = order.products.all()
        return context


class OrderListView(ListView):
    model = Order
    template_name = "shop/orders.html"
    context_object_name="orders"


class OrderDetailView(DetailView):
    model = Order
    template_name = "shop/checkout.html"


# @method_decorator(csrf_exempt, name='dispatch')
class AddToCardView(View):
    def get(self, request,pk):
        user = request.user
        product_id = pk
        product = Product.objects.get(id=product_id)

        order = Order.objects.filter(user=user, is_fullfield=False).first()
        if not order:
            order = Order()
            order.user = user
            order.is_fullfield = False
            order.save()

        if product not in order.products.all():
            order.products.add(product)
            order.total_price = order.total_price+product.price
            order.save()

        return redirect('/shop/')


@method_decorator(csrf_exempt, name='dispatch')
class CheckOutView(View):
    def get(self,request,order_id):
        order=Order.objects.get(id=order_id)
        return render(request,"shop/checkout.html",{"order":order,"products":order.products.all()})
    def post(self, request,order_id):
        order_id = order_id
        order = Order.objects.get(id=order_id)

        payment = Payment()
        payment.order = order
        payment.payment_method = "MPESA"
        payment.code = request.POST.get('mpesa_code')
        payment.amount = request.POST.get('mpesa_amount')
        payment.account_no = request.POST.get('mpesa_name')

        payment.save()
        print(float(request.POST.get('mpesa_amount')) < float(order.total_price))
        if float(request.POST.get('mpesa_amount')) < float(order.total_price):
            return render(request,"shop/checkout.html",{'errors':"The Amount Paid is not enough to fullfill the order, you will be refunded soon!"})
        else:
            order.is_fullfield = True
            order.save()
            return JsonResponse({"PAYMENT_ACCEPTED": True})
