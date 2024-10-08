# Generated by Django 5.0.2 on 2024-04-13 11:55

import django.db.models.deletion
import video.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('upload_date', models.DateTimeField(auto_now_add=True)),
                ('video', models.FileField(storage=video.models.YandexStorage(), upload_to='')),
                ('status', models.CharField(choices=[('public', 'Public'), ('private', 'Private'), ('unlisted', 'Unlisted')], default='unlisted', max_length=20)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_videos', to=settings.AUTH_USER_MODEL)),
                ('list_favorited_by_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('liked_by_user', models.BooleanField(default=False)),
                ('likes_count', models.PositiveIntegerField(default=0)),
                ('parent_comment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='video.comment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_user', to=settings.AUTH_USER_MODEL)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_video', to='video.video')),
            ],
        ),
        migrations.CreateModel(
            name='ViewHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('viewed_date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='video.video')),
            ],
        ),
        migrations.AddField(
            model_name='video',
            name='users',
            field=models.ManyToManyField(through='video.ViewHistory', to=settings.AUTH_USER_MODEL),
        ),
    ]
