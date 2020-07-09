import uuid
from django.db import models
from django.contrib.auth.models import User

def get_image_dir(instance,filename):
	return 'expert_images/{0}{1}'.format(uuid.uuid4(), filename)

class Expert(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	user=models.ForeignKey(User,on_delete=models.CASCADE)
	is_free=models.BooleanField(default=True)
	specialty = models.CharField(max_length=256,blank=True,null=True)
	gcm_token=models.TextField(blank=True,null=True)
	profile = models.ImageField(upload_to=get_image_dir,blank=True,null=True)

	
	def __str__(self):
		return self.user.username
