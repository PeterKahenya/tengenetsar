# Generated by Django 3.0.7 on 2020-07-07 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='expert',
            name='gcm_token',
            field=models.TextField(blank=True, null=True),
        ),
    ]