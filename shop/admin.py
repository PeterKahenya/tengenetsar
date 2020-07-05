from django.contrib import admin

from .models import *

admin.site.register(Product)
admin.site.register(Supplier)

admin.site.register(Category)
admin.site.register(Payment)
admin.site.register(Order)

