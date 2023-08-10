from django.db import models
from django.contrib.auth.models import User
import uuid

class Caller(models.Model):
	id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user=models.ForeignKey(User,on_delete=models.CASCADE)
	address_longitude=models.FloatField(blank=True,null=True)
	address_latitude=models.FloatField(blank=True,null=True)
	phone_number=models.CharField(blank=True,null=True,max_length=11)


	def __str__(self):
		return self.user.username
