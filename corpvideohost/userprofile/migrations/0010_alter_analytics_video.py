# Generated by Django 5.0.4 on 2024-05-12 14:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0009_alter_analytics_video'),
        ('video', '0004_comment_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='analytics',
            name='video',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='video.video'),
        ),
    ]
