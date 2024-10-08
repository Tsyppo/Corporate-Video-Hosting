from rest_framework import serializers
from userprofile.models import (
    Analytics,
    GroupStatus,
    PlaylistStatus,
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


class AnalyticsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Analytics
        fields = "__all__"
