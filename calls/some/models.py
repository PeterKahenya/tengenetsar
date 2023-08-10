import uuid
from django.db import models
from django.contrib.auth.models import User

class Call(models.Model):
	id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	caller=models.ForeignKey(User,on_delete=models.CASCADE,related_name='initiator',blank=True,null=True)
	callee=models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True)
	created = models.DateTimeField(auto_now_add=True, editable=False,blank=True,null=True)
	callee_accepted = models.BooleanField(blank=True,null=True)
	room=models.TextField(blank=True,null=True)

	def __str__(self):
		return self.caller.username

class Chat(models.Model):
	id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name='sender')
	call=models.ForeignKey(Call,on_delete=models.CASCADE,related_name="chat")
	text=models.TextField(blank=True,null=True)
	created = models.DateTimeField(auto_now_add=True, editable=False,blank=True,null=True)

	def __str__(self):
		return self.text

