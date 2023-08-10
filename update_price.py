from shop.models import Category,Product
from decimal import Decimal

nov_category=Category.objects.filter(name="NOVEMBER SPECIAL OFFER").first()
products=Product.objects.filter(category=nov_category)


for product in products:
    product.price=product.price*Decimal(1.14)*Decimal(1.20)
    product.save()
