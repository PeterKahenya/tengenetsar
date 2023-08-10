import uuid
from django.db import models
from django.contrib.auth.models import User

def get_image_dir(instance,filename):
	return 'product_images/{0}{1}'.format(uuid.uuid4(), filename)

class Supplier(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	image = models.ImageField(upload_to=get_image_dir)
	title = models.CharField(max_length=256)

class Category(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name=models.CharField(max_length=256)
		
class Product(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	category = models.ForeignKey('Category',on_delete=models.CASCADE)
	name=models.CharField(max_length=256)
	description = models.TextField()
	image = models.ImageField(upload_to=get_image_dir)
	price = models.DecimalField(max_digits=9,decimal_places=2)
	suppler = models.ForeignKey(Supplier,on_delete=models.CASCADE,blank=True,null=True)


class Order(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user=models.ForeignKey(User,on_delete=models.CASCADE)
	products=models.ManyToManyField(Product)
	total_price = models.DecimalField(max_digits=12,decimal_places=2,default=0.00)
	is_fullfield=models.BooleanField(default=False)

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    code=models.CharField(max_length=256)
    amount=models.DecimalField(max_digits=9,decimal_places=2)
    account_no = models.CharField(max_length=256)
    payment_method = models.CharField(max_length=256)

    def __str__(self):
        return self.payment_method(env)


