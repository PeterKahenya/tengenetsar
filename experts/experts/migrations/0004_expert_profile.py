# Generated by Django 3.0.7 on 2020-07-09 09:20

from django.db import migrations, models
import experts.models


class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0003_expert_specialty'),
    ]

    operations = [
        migrations.AddField(
            model_name='expert',
            name='profile',
            field=models.ImageField(blank=True, null=True, upload_to=experts.models.get_image_dir),
        ),
    ]
