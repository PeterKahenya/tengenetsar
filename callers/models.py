from django.db import models
from django.contrib.auth.models import User
import uuid

class Caller(models.Model):
	id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user=models.ForeignKey(User,on_delete=models.CASCADE)
