from django.db import models
from django.contrib.auth.models import User
import uuid


def get_product_images_directory(instance, filename):
	return 'product_images/{0}{1}'.format(uuid.uuid4(), filename)


def get_supplier_logos_directory(instance, filename):
	return 'supplier_logos/{0}{1}'.format(uuid.uuid4(), filename)


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)

    def __str__(self):
        return self.name


class Supplier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to=get_supplier_logos_directory)
    title = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)

    def __str__(self):
        return self.title



class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)
	
    def __str__(self):
        return self.title



class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    serial_no = models.CharField(max_length=1000)
    name = models.CharField(max_length=1000)
    category = models.ForeignKey(Category,on_delete=models.Model,related_name="products")
    image = models.ImageField(upload_to=get_product_images_directory)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    supplier = models.ForeignKey(Supplier,on_delete=models.CASCADE,blank=True,null=True,related_name="products")
    tags = models.ManyToManyField(Tag,blank=True,related_name="products")
    associated = models.ManyToManyField('Product',blank=True,related_name="associated_products")
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)

    def __str__(self):
        return self.name



class DetailName(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)
    
    def __str__(self):
        return self.name



class ProductDetail(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product,on_delete=models.CASCADE,blank=True,null=True,related_name="details")
    detail_name = models.ForeignKey(DetailName,on_delete=models.CASCADE,blank=True,null=True,related_name="details")
    value = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)
    
    def __str__(self):
        return self.detail_name.name + " : "+ self.value



class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product,on_delete=models.CASCADE,blank=True,null=True,related_name="order_items")
    quantity = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)
    
    def __str__(self):
        return self.product.name + " : " + str(self.quantity)



class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    added_by = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True, related_name="orders_added")
    checkout_by = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True, related_name="orders_checkedout")
    order_items = models.ManyToManyField(OrderItem,blank=True,related_name="orders")
    total_price = models.DecimalField(max_digits=12,decimal_places=2,default=0.00)
    completed=models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)


    def update_total(self):
        self.total_price=0
        for order_item in self.order_items.all():
            self.total_price += order_item.product.price*order_item.quantity


    def update(self, order_item):
        for oi in self.order_items.all():
            if oi.product.id == order_item.get("product").get("id"):
                if int(order_item.get("quantity"))==0:
                    self.order_items.remove(oi)
                    self.update_total()
                    self.save()
                    return None
                else:
                    oi.quantity =  int(order_item.get("quantity"))
                    oi.save()
                    self.update_total()
                    self.save()
                    return oi

        product = Product.objects.get(id=order_item.get("product").get("id"))
        new_order_item = OrderItem()
        new_order_item.product=product
        new_order_item.quantity=int(order_item.get("quantity"))
        new_order_item.save()
        self.order_items.add(new_order_item)
        self.update_total()
        self.save()
        return new_order_item







    def update_quantity(self, order_item,updated_quantity):

            if updated_quantity==0:
                self.order_items.remove(order_item)
            else:
                order_item.quantity = updated_quantity

            #update price
            self.total_price=0
            for order_item in self.order_items.all():
                print(order_item)
                self.total_price += order_item.product.price*order_item.quantity
            print(order_item)
            order_item.save()
            self.save()
            return order_item

    def get_or_create_order_item(self, product):
        for order_item in self.order_items.all():
            if order_item.product==product:
                return order_item

        order_item=OrderItem()
        order_item.product=product
        order_item.save()
        self.order_items.add(order_item)
        self.save()
        return order_item


    def __str__(self):
        return str(self.id)



class ShippingAddress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order,on_delete=models.CASCADE,blank=True,null=True,related_name="shipping_addresses")
    owner = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True,related_name="shipping_addresses")
    full_name = models.TextField(blank=True,null=True)
    phone = models.CharField(max_length=15,blank=True,null=True)
    county = models.CharField(max_length=256,blank=True,null=True)
    city = models.CharField(max_length=256,blank=True,null=True)
    description = models.CharField(max_length=500,blank=True,null=True)
    longitude = models.FloatField(blank=True,null=True,default=0.0)
    latitude = models.FloatField(blank=True,null=True,default=0.0)
    is_custom = models.BooleanField(blank=True,null=True,default=False)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)

    def __str__(self):
        return self.city


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="reviews")
    ratting = models.IntegerField(blank=True,null=True)
    comment = models.TextField(blank=True,null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True,related_name="reviews")
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)
 
    def __str__(self):
        return self.product.name + " is " + self.comment + " ratted "+str(self.ratting)



class MPESAPayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code=models.CharField(max_length=256)
    amount=models.DecimalField(max_digits=9,decimal_places=2,default=0.00)
    account_no = models.CharField(max_length=256)
    payment_method = models.CharField(max_length=256)
    payment_by = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)

    def __str__(self):
        return self.payment_by
    

class Delivery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    address = models.ForeignKey(ShippingAddress,on_delete=models.CASCADE,related_name="deliveries")
    mpesa_payment = models.ForeignKey(MPESAPayment,on_delete=models.CASCADE,related_name="deliveries")
    requested_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name="deliveries",null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)

    def __str__(self):
        return "Delivery to " + str(self.address)

class Shared(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    added_by = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True, related_name="shared_orders_added")
    checkout_by = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True, related_name="shared_orders_checkedout")
    order_items = models.ManyToManyField(OrderItem,blank=True,related_name="orders_shared")
    created_at = models.DateTimeField(auto_now_add=True,editable=False)
    updated_at = models.DateTimeField(auto_now=True,editable=False)


        
