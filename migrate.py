from django.db import connections
from shop.models import Product,Supplier,Category
from customers.models import Customer
from experts.models import Expert
from django.contrib.auth.models import User
cursor = connections["old"].cursor()

# print(cursor.execute("SELECT * FROM experts_expert"))

# print(cursor.fetchone())
# print(cursor.fetchone())
# print(cursor.fetchone())
# print(cursor.fetchone())
# print(cursor.fetchone())
# print(cursor.fetchone())


# for x in range(0,132):
# 	id,name,description,image,price,category,supplier,serial_no=cursor.fetchone()

# 	p=Product()
# 	p.id=id
# 	p.category_id=category
# 	p.supplier_id=supplier
# 	p.serial_no=serial_no
# 	p.price=price
# 	p.image=image
# 	p.name=name
# 	p.description=description

# 	p.save()

# for x in range(0,5):
# 	id,name=cursor.fetchone()
# 	category = Category()
# 	category.id=id
# 	category.name=name
# 	category.save()

# for x in range(0,1):
# 	id,image,name=cursor.fetchone()
# 	supplier = Supplier()
# 	supplier.id=id
# 	supplier.title=name
# 	supplier.image=image
# 	supplier.save()


# for x in range(0,74):
# 	id,password,last_login,is_superuser,username,first_name,last_name,email,is_staff,is_active,date_joined=cursor.fetchone()
# 	user=User()
# 	user.id=id
# 	user.password=password
# 	user.last_login=last_login
# 	user.is_superuser=is_superuser
# 	user.username=username
# 	user.first_name=first_name
# 	user.last_name=last_name
# 	user.email=email
# 	user.is_staff=is_staff
# 	user.is_active=is_active
# 	user.date_joined=date_joined
# 	user.save()

# for x in range(0,27):
# 	id,user_id,address_longitude,address_latitude,phone_number=cursor.fetchone()
# 	c=Customer()
# 	c.id=id
# 	c.user_id=user_id
# 	c.address_latitude=address_latitude
# 	c.address_longitude=address_longitude
# 	c.phone_number=phone_number
# 	c.save()

# for x in range(0,33):
# 	id,is_free,user_id,gcm_token,specialty,profile,address_latitude,address_longitude,phone_number=cursor.fetchone()
# 	e=Expert()
# 	e.id=id
# 	e.user_id=user_id
# 	e.specialty=specialty
# 	e.gcm_token=gcm_token
# 	e.profile=profile
# 	e.is_free=is_free
# 	e.address_latitude=address_latitude
# 	e.address_longitude=address_longitude
# 	e.phone_number=phone_number
# 	e.save()

# from rest_framework.authtoken.models import Token

# for user in User.objects.all():
#     Token.objects.get_or_create(user=user)