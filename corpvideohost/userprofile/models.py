from django.db import models
from user.models import User
from video.models import Video


class PlaylistStatus(models.TextChoices):
    PUBLIC = "public", "Public"
    PRIVATE = "private", "Private"
    UNLISTED = "unlisted", "Unlisted"


class GroupStatus(models.TextChoices):
    PUBLIC = "public", "Public"
    PRIVATE = "private", "Private"
    UNLISTED = "unlisted", "Unlisted"


class Group(models.Model):
    title = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name="member_of_groups", blank=True)
    waiting = models.ManyToManyField(
        User, related_name="waiting_for_groups", blank=True
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    status = models.CharField(
        max_length=20, choices=GroupStatus.choices, default=GroupStatus.UNLISTED
    )
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_groups"
    )
    videos = models.ManyToManyField(Video, blank=True)
    playlists = models.ManyToManyField("Playlist", blank=True, related_name="groups")

    def __str__(self):
        return self.title


# {
#     "status": "public",
#     "title": "example title",
#     "description": "example description",
#     "creator": "1",
# }


class Playlist(models.Model):
    title = models.CharField(max_length=100)
    creation_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, choices=PlaylistStatus.choices, default=PlaylistStatus.UNLISTED
    )
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="playlists_group"
    )
    videos = models.ManyToManyField(Video, blank=True)

    def __str__(self):
        return self.title


# {
#     "status": "public",
#     "title": "example title",
#     "group": "1",
# }


class Analytics(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, blank=True)
    view_date = models.DateTimeField(auto_now_add=True)
    duration = models.CharField(max_length=100, default="0")
    full_duration = models.CharField(max_length=100, default="0")
    status = models.CharField(max_length=100, default="В процессе")

    def __str__(self):
        return f"{self.user.username} - {self.view_date} - {self.duration}"


class SearchHistory(models.Model):
    query_text = models.CharField(max_length=255)
    search_date = models.DateTimeField(auto_now_add=True)
    user_search = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_search"
    )

    def __str__(self):
        return f"Search: {self.query_text} by {self.user}"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorites = models.ManyToManyField(Video)
    groups = models.ManyToManyField(Group)
    playlists = models.ManyToManyField(Playlist)
    search_history = models.ManyToManyField(SearchHistory)
