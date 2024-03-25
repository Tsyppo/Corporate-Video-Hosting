# Generated by Django 5.0.2 on 2024-03-10 13:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
        ('video', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField()),
                ('access_status', models.CharField(choices=[('public', 'Public'), ('private', 'Private'), ('unlisted', 'Unlisted')], default='unlisted', max_length=20)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_groups', to='user.user')),
                ('members', models.ManyToManyField(to='user.user')),
                ('videos', models.ManyToManyField(to='video.video')),
            ],
        ),
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('access_status', models.CharField(choices=[('public', 'Public'), ('private', 'Private'), ('unlisted', 'Unlisted')], default='unlisted', max_length=20)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='playlists_group', to='userprofile.group')),
                ('videos', models.ManyToManyField(to='video.video')),
            ],
        ),
        migrations.CreateModel(
            name='SearchHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query_text', models.CharField(max_length=255)),
                ('search_date', models.DateTimeField(auto_now_add=True)),
                ('user_search', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_search', to='user.user')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_groups', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_creator', to='userprofile.group')),
                ('favorites', models.ManyToManyField(to='video.video')),
                ('groups', models.ManyToManyField(to='userprofile.group')),
                ('playlists', models.ManyToManyField(to='userprofile.playlist')),
                ('search_history', models.ManyToManyField(to='userprofile.searchhistory')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='user.user')),
            ],
        ),
    ]
