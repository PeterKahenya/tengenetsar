import uuid
from django.db import models
from callers.models import Caller
from experts.models import Expert
from django.contrib.auth.models import User

class Call(models.Model):
	id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	caller=models.ForeignKey(Caller,on_delete=models.CASCADE,related_name='initiator')
	expert=models.ForeignKey(Expert,on_delete=models.CASCADE)

class Chat(models.Model):
	id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name='sender')
	receiver=models.ForeignKey(User,on_delete=models.CASCADE)
	call=models.ForeignKey(Call,on_delete=models.CASCADE)