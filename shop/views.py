from django.shortcuts import render,redirect
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import locale
from .models import Product, Order,Category,Payment
from experts.models import Expert
from callers.models import Caller
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import os
from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.db.models import Q
import datetime
from django.conf import settings
from .send_emails import send_receipt
# from .tasks import send_receipt as async_send_email



receipt_no=0


def get_logged_user(request,order_id):
    order = Order.objects.get(id=order_id)
    user=None
    expert=Expert.objects.filter(user=request.user).first()
    if expert:
        order.expert=expert
        order.save()
        user=expert
    else:
        caller=Caller.objects.filter(user=request.user).first()
        order.caller=caller
        order.save()
        user=caller
    return user

class ProductsListView(ListView):
    model = Product
    template_name = "shop/index.html"

    def get_context_data(self, **kwargs):
        user=self.request.user
        context = super().get_context_data(**kwargs)
        context['products'] = Product.objects.all()
        context['categories'] = Category.objects.all()


        order = Order.objects.filter(added_by=self.request.user, is_fullfield=False).first()
        if not order:
            order = Order()
            order.is_fullfield = False
            order.added_by=user
            order.save()
        context['user']=get_logged_user(self.request,order.id)
        context['order_products'] = order.products.all()
        return context

class ProductDetailView(DetailView):
    model = Product
    template_name = "shop/product.html"

    def get_context_data(self, **kwargs):
        user=self.request.user
        context = super().get_context_data(**kwargs)
        context['products'] = Product.objects.all()
        context['categories'] = Category.objects.all()
        
        order = Order.objects.filter(Q(added_by=user)|Q(checkout_by=user)).order_by("created").first()
        if not order:
            order = Order()
            order.is_fullfield = False
            order.save()

        context['user']=get_logged_user(self.request,order.id)
        context['order_products'] = order.products.all()
        return context


class OrderListView(ListView):
    model = Order
    template_name = "shop/orders.html"

    def get_context_data(self, **kwargs):
        user=self.request.user
        context = super().get_context_data(**kwargs)
        context['orders'] = Order.objects.filter(Q(added_by=user)|Q(checkout_by=user)).order_by("created")
        return context


class OrderDetailView(View):
    def get(self, request,order_id):
        order = Order.objects.get(id=order_id)
        user=None
        expert=Expert.objects.filter(user=request.user).first()
        if expert:
            order.expert=expert
            order.save()
            user=expert
        else:
            caller=Caller.objects.filter(user=request.user).first()
            order.caller=caller
            order.save()
            user=caller
        return render(request,"shop/checkout.html",{"order":order,"user":user})


@method_decorator(csrf_exempt, name='dispatch')
class AddToCartView(View):
    def get(self, request,pk):
        user = request.user
        product_id = pk
        product = Product.objects.get(id=product_id)

        order = Order.objects.filter(added_by=self.request.user, is_fullfield=False).first()

        if not order:
            order = Order()
            order.is_fullfield = False
            order.save()
        
        user=get_logged_user(self.request,order.id)

        if product not in order.products.all():
            order.products.add(product)
            order.total_price = order.total_price+product.price
            order.save()

        return redirect('/shop/')


@method_decorator(csrf_exempt, name='dispatch')
class CheckOutView(View):
    def get_receipt_no(self):
        global receipt_no
        day=datetime.datetime.today().day
        if day<10:
            day="0"+str(day)
        month=datetime.datetime.today().month
        if month<10:
            month="0"+str(month)
        current=receipt_no
        if receipt_no<10:
            current="0"+str(receipt_no)
        receipt=str(datetime.datetime.today().year)+str(month)+str(day)+str(current)
        receipt_no+=1
        return receipt
    def link_callback(self,uri, rel):

        sUrl = settings.STATIC_URL      
        sRoot = settings.STATIC_ROOT    
        mUrl = settings.MEDIA_URL      
        mRoot = settings.MEDIA_ROOT    

        if uri.startswith(mUrl):
            path = os.path.join(mRoot, uri.replace(mUrl, ""))
        elif uri.startswith(sUrl):
            path = os.path.join(sRoot, uri.replace(sUrl, ""))
        else:
            return uri

        if not os.path.isfile(path):
                raise Exception( 'media URI must start with %s or %s' % (sUrl, mUrl))
        return path
    def receipt(self,payment):
        template = get_template('shop/receipt.html')
        context = {'receipt_no':self.get_receipt_no() ,'payment':payment,"products":payment.order.products.all(),'date':datetime.datetime.today().strftime('%d/%m/%Y')}
        html = template.render(context)
        receipt_file_path=os.path.join(settings.MEDIA_ROOT,"receipts/"+self.request.user.first_name+self.request.user.last_name+"Receipt"+self.get_receipt_no()+".pdf")
        receipt_file = open(receipt_file_path, "w+b")
        pisaStatus = pisa.CreatePDF(html, dest=receipt_file, link_callback=self.link_callback)
        if pisaStatus.err:
            return HttpResponse('We had some errors <pre>' + html + '</pre>')
        receipt_file.close()
        return receipt_file_path

    def get(self,request,order_id):
        order=Order.objects.get(id=order_id)
        user=get_logged_user(request,order_id)
        return render(request,"shop/checkout.html",{"order":order,"products":order.products.all(),"user":user})
    
    def post(self, request,order_id):
        order = Order.objects.get(id=order_id)
        user=get_logged_user(request,order_id)
        print(request.POST.get('user_longitude')+"---"+request.POST.get('user_latitude'))
        user.address_longitude=request.POST.get('user_longitude')
        user.address_latitude=request.POST.get('user_latitude')
        user.save()

        print(request.POST.get('mpesa_amount'))

        payment = Payment()
        payment.order = order
        payment.payment_method = "MPESA"
        payment.code = request.POST.get('mpesa_code')
        payment.amount = float(request.POST.get('mpesa_amount'))
        payment.account_no = request.POST.get('mpesa_name')

        payment.save()
        print(payment.amount < float(order.total_price))
        if payment.amount < float(order.total_price):
            receipt_path=self.receipt(payment)
            order.checkout_by=user.user
            order.save()
            send_receipt(payment.id,user.user.email,receipt_path,user)
            return render(request,"shop/checkout.html",{'errors':"The Amount Paid is not enough to fullfill the order, you will be refunded soon!"})
        else:
            order.is_fullfield = True
            order.checkout_by=user.user
            order.save()
            receipt_path=self.receipt(payment)
            send_receipt(payment.id,user.user.email,receipt_path,user)
            return redirect("shop/orders/"+str(order.id)+"/track")

class TrackShipment(View):
    def get(self,request):
        return render(request,"shop/track_shipment.html")