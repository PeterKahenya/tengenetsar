# Generated by Django 3.0.7 on 2020-07-05 14:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('calls', '0004_auto_20200705_1351'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='call',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat', to='calls.Call'),
        ),
    ]