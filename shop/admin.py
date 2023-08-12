from django.contrib import admin
from .models import *

class ProductsAdmin(admin.ModelAdmin):
    list_display = ('name','description','price')
    search_fields = ('name','description','price')




admin.site.register(Product,ProductsAdmin)
admin.site.register(DetailName)
admin.site.register(Review)
admin.site.register(ProductDetail)
admin.site.register(Category)
admin.site.register(Supplier)
admin.site.register(Tag)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(MPESAPayment)
admin.site.register(Delivery)
admin.site.register(ShippingAddress)
admin.site.register(Shared)


