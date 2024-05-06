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
    members = models.ManyToManyField(User, related_name="member_of_groups")
    waiting = models.ManyToManyField(User, related_name="waiting_for_groups")
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
    created_groups = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="group_creator", null=True
    )
