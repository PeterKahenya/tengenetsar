# Generated by Django 3.0.7 on 2020-07-09 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0002_expert_gcm_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='expert',
            name='specialty',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]
