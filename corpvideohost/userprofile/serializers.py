from rest_framework import serializers
from userprofile.models import (
    GroupStatus,
    PlaylistStatus,
    SearchHistory,
    Playlist,
    Group,
    UserProfile,
)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=GroupStatus.choices)

    class Meta:
        model = Group
        fields = "__all__"


class PlaylistSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=PlaylistStatus.choices)

    class Meta:
        model = Playlist
        fields = "__all__"


class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = "__all__"
