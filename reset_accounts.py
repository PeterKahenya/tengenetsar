from django.contrib.auth.models import User

all_users = User.objects.all()


for user in all_users:
	user.username=user.email
	user.set_password("1234"+"@WalkingLight2020")
	user.save()