from rest_framework import serializers
from .models import User, UserRole, UserStatus


class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=UserRole.choices)
    status = serializers.ChoiceField(choices=UserStatus.choices)

    class Meta:
        model = User
        fields = "__all__"
