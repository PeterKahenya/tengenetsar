# Generated by Django 3.0.7 on 2020-07-09 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('callers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='caller',
            name='address_latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='caller',
            name='address_longitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='caller',
            name='phone_number',
            field=models.CharField(blank=True, max_length=11, null=True),
        ),
    ]
