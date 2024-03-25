from django.db import models

from corpvideohost.yandex_s3_storage import ClientDocsStorage
from user.models import User


class VideoStatus(models.TextChoices):
    PUBLIC = "public", "Public"
    PRIVATE = "private", "Private"
    UNLISTED = "unlisted", "Unlisted"


class Video(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    upload_date = models.DateTimeField(auto_now_add=True)
    video_url = models.FileField(storage=ClientDocsStorage())
    status = models.CharField(
        max_length=20, choices=VideoStatus.choices, default=VideoStatus.UNLISTED
    )
    favorited_by_user = models.BooleanField(default=False)
    users = models.ManyToManyField(User, through="ViewHistory")

    def __str__(self):
        return self.title


# {
#     "status": "public",
#     "title": "example title",
#     "description": "example description",
#     "creator": "1",
# }


class ViewHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    viewed_date = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    text = models.TextField()
    liked_by_user = models.BooleanField(default=False)
    likes_count = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comment_user"
    )
    video = models.ForeignKey(
        Video, on_delete=models.CASCADE, related_name="comment_video"
    )
    parent_comment = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )

    def __str__(self):
        return f"Comment by {self.user} on {self.video}"
