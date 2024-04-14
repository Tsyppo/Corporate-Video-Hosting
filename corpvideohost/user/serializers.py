from django.contrib.auth import authenticate
from django.contrib.auth.base_user import AbstractBaseUser
from django.forms import ValidationError
from rest_framework import serializers
from .models import User, UserRole, UserStatus


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "patronymic",
            "phone_number",
            "avatar",
            "role",
            "status",
            "password",
            "registration_date",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
