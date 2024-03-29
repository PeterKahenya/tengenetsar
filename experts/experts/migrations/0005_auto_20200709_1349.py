# Generated by Django 3.0.7 on 2020-07-09 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0004_expert_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='expert',
            name='address_latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='expert',
            name='address_longitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='expert',
            name='phone_number',
            field=models.CharField(blank=True, max_length=11, null=True),
        ),
    ]
