from rest_framework import serializers
from .models import Video, VideoStatus, ViewHistory, Comment


class VideoSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=VideoStatus.choices)

    class Meta:
        model = Video
        fields = "__all__"


class ViewHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewHistory
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
