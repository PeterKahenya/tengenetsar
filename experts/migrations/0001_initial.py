# Generated by Django 2.2.14 on 2020-08-16 13:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import experts.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Expert',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('is_free', models.BooleanField(default=True)),
                ('specialty', models.CharField(blank=True, max_length=256, null=True)),
                ('gcm_token', models.TextField(blank=True, null=True)),
                ('profile', models.ImageField(blank=True, null=True, upload_to=experts.models.get_image_dir)),
                ('address_longitude', models.FloatField(blank=True, null=True)),
                ('address_latitude', models.FloatField(blank=True, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=11, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
