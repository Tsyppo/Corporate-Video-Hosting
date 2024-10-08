# Generated by Django 5.0.2 on 2024-04-13 12:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('video', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='list_favorited_by_user',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
