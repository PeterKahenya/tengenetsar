import uuid
from django.db import models
from caller.models import Caller
from fundi.models import Fundi
from django.contrib.auth.models import User

class Call(models.Model):
	call_id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	caller=models.ForeignKey(Caller,on_delete=models.CASCADE,related_name='initiator')
	fundi=models.ForeignKey(Fundi,on_delete=models.CASCADE)

class Chat(models.Model):
	chat_id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name='sender')
	receiver=models.ForeignKey(User,on_delete=models.CASCADE)
	actual_call=models.ForeignKey(Call,on_delete=models.CASCADE)
