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
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404



receipt_no=0


def get_logged_user(request,order_id):
    order = Order.objects.get(id=order_id)
    user=None
    expert=Expert.objects.filter(user=request.user).first()
    if expert:
        user=expert
    else:
        caller=Caller.objects.filter(user=request.user).first()
        if caller:
            user=caller
        else:
            user=request.user
    return user

class ProductsListView(View):
    def get(self, request):
        if request.user.is_authenticated:
            context={}
            context['products'] = Product.objects.all()
            context['categories'] = Category.objects.all()
            order = Order.objects.filter(added_by=self.request.user, is_fullfield=False).first()
            if not order:
                order = Order()
                order.is_fullfield = False
                order.added_by=request.user
                order.save()
            context['user']=request.user
            context['order_products'] = order.products.all()
            return render(request,"shop/index.html",context)
        else:
            return render(request,"shop/index.html",{"products":Product.objects.all(),"categories":Category.objects.all()})

class ProductDetailView(DetailView):
    model = Product
    template_name = "shop/product.html"

    def get_context_data(self, **kwargs):
        if self.request.user.is_authenticated:
            user=self.request.user
            context = super().get_context_data(**kwargs)
            context['products'] = Product.objects.all()
            context['categories'] = Category.objects.all()
            
            order = Order.objects.filter(Q(added_by=user)|Q(checkout_by=user)).order_by("created").first()
            if not order:
                order = Order()
                order.is_fullfield = False
                order.added_by=user
                order.save()

            context['user']=user
            context['order_products'] = order.products.all()
            return context
        else:
            context = super().get_context_data(**kwargs)
            context['products'] = Product.objects.all()
            context['categories'] = Category.objects.all()
            context['order_products'] = []
            return context



class OrderListView(LoginRequiredMixin,ListView):
    login_url = '/caller/login'
    redirect_field_name = 'next'
    model = Order
    template_name = "shop/orders.html"

    def get_context_data(self, **kwargs):
        user=self.request.user
        context = super().get_context_data(**kwargs)
        context["orders"]=[]
        for order in Order.objects.filter(Q(added_by=user)|Q(checkout_by=user)).order_by("created"):
            if order.products.count()!=0:
                context["orders"].append(order)
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
        if request.user.is_authenticated:
            user = request.user
            product_id = pk
            product = Product.objects.get(id=product_id)

            order = Order.objects.filter(added_by=self.request.user, is_fullfield=False).first()

            if not order:
                order = Order()
                order.is_fullfield = False
                order.added_by=user
                order.save()

            if product not in order.products.all():
                order.products.add(product)
                order.total_price = order.total_price+product.price
                order.save()

            return redirect('/shop/')
        else:
            return redirect("/caller/login")


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

    def receipt(self,payment,number):
        subtotal=float(payment.order.total_price)*(100/114)
        vat=float(payment.order.total_price)-subtotal
        print(vat)
        print(subtotal)

        template = get_template('shop/receipt.html')
        context = {'receipt_no':number,'vat':round(vat,2),'subtotal':round(subtotal,2) ,'payment':payment,"products":payment.order.products.all(),'date':datetime.datetime.today().strftime('%d/%m/%Y')}
        html = template.render(context)
        receipt_file_path=os.path.join(settings.MEDIA_ROOT,"receipts/"+self.request.user.first_name+self.request.user.last_name+"Receipt"+self.get_receipt_no()+".pdf")
        receipt_file = open(receipt_file_path, "w+b")
        pisaStatus = pisa.CreatePDF(html, dest=receipt_file, link_callback=self.link_callback)
        if pisaStatus.err:
            return HttpResponse('We had some errors <pre>' + html + '</pre>')
        receipt_file.close()
        return receipt_file_path
    
    def generate_po(self,payment,number):
        template = get_template('shop/lpo.html')
        subtotal=float(payment.order.total_price)*(100/114)
        vat=float(payment.order.total_price)-subtotal
        context = {'receipt_no':number,'vat':round(vat,2),'subtotal':round(subtotal,2) ,'payment':payment,"products":payment.order.products.all(),'date':datetime.datetime.today().strftime('%d/%m/%Y')}
        html = template.render(context)
        receipt_file_path=os.path.join(settings.MEDIA_ROOT,"lpos/"+self.request.user.first_name+self.request.user.last_name+"LPO"+self.get_receipt_no()+".pdf")
        receipt_file = open(receipt_file_path, "w+b")
        pisaStatus = pisa.CreatePDF(html, dest=receipt_file, link_callback=self.link_callback)
        if pisaStatus.err:
            return HttpResponse('We had some errors <pre>' + html + '</pre>')
        receipt_file.close()
        return receipt_file_path

    def get(self,request,order_id):
        if request.user.is_authenticated:
            order=Order.objects.get(id=order_id)
            user=get_logged_user(request,order_id)
            return render(request,"shop/checkout.html",{"order":order,"products":order.products.all(),"user":user})
        else:
            return redirect("/caller/login")
        
    
    def post(self, request,order_id):
        order = Order.objects.get(id=order_id)
        user=get_logged_user(request,order_id)
        # print(request.POST.get('user_longitude')+"---"+request.POST.get('user_latitude'))
        user.address_longitude=request.POST.get('user_longitude')
        user.address_latitude=request.POST.get('user_latitude')
        user.save()

        # print(request.POST.get('mpesa_amount'))

        payment = Payment()
        payment.order = order
        payment.payment_method = "MPESA"
        payment.code = request.POST.get('mpesa_code')
        payment.amount = float(request.POST.get('mpesa_amount'))
        payment.account_no = request.POST.get('mpesa_name')

        payment.save()

        receipt_number=self.get_receipt_no()
        receipt_path=self.receipt(payment,receipt_number)

        if payment.amount < float(order.total_price):
            order.checkout_by=user.user
            order.save()
            send_receipt(payment.id,user.user.email,receipt_path,user,lpo_path=None)
            return render(request,"shop/checkout.html",{'errors':"The Amount Paid is not enough to fullfill the order, you will be refunded soon!"})
        else:
            order.is_fullfield = True
            order.checkout_by=user.user
            order.save()
            lpo_path=self.generate_po(payment,receipt_number) #this should be generated once enough money is sent
            send_receipt(payment.id,user.user.email,receipt_path,user,lpo_path)
            return redirect("shop/orders/"+str(order.id)+"/track")

class TrackShipment(View):
    def get(self,request):
        return render(request,"shop/track_shipment.html")

class CategoryView(View):
    def get(self,request,pk):
            try:
                category=Category.objects.get(pk=pk)
                products=Product.objects.filter(category=category)
            except Category.DoesNotExist:
                raise Http404("Category does not exist")
            return render(request,"shop/index.html",{"products":products,"categories":Category.objects.all()})

class RemoveProduct(LoginRequiredMixin,View):
    def get(self,request,product_id,order_id):
        next_url=request.GET.get("next")
        try:
            product=Product.objects.get(id=product_id)
            order=Order.objects.get(id=order_id)
            if product in order.products.all():
                order.products.remove(product)
                order.total_price=order.total_price-product.price
                order.save()
                if next_url:
                    return redirect(next_url)
                else:
                    return redirect("/shop/orders/"+str(order_id)+"/checkout")
            else:
                if next_url:
                    return redirect(next_url)
                else:
                    return redirect("/shop/orders/"+str(order_id)+"/checkout")
        except Product.DoesNotExist:
            raise Http404("Category does not exist")
        except Order.DoesNotExist:
            raise Http404("Category does not exist")

 
