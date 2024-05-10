from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import TokenError, RefreshToken


@api_view(["POST"])
def user_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    try:
        user = User.objects.get(username=username)
        if check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            return Response(
                {
                    "message": "Successfully logged in",
                    "refresh": str(refresh),
                    "user": user_serializer.data,
                    "id": user.pk,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )
    except User.DoesNotExist:
        return Response(
            {"error": "User does not exist"}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
def check_token(request):
    token = request.data.get("token")
    if not token:
        return Response({"valid": False}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh = RefreshToken(token)
        user_id = refresh.payload.get("user_id")
        user = User.objects.get(id=user_id)
        return Response({"valid": True}, status=status.HTTP_200_OK)
    except TokenError:
        return Response({"valid": False}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({"valid": False}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET", "POST"])
def user_list(request):
    if request.method == "GET":
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = (
                serializer.save()
            )  # Сохраняем пользователя и получаем объект пользователя
            user_data = (
                serializer.data
            )  # Получаем данные о пользователе из сериализатора
            user_data["id"] = user.id  # Добавляем ID пользователя к данным
            return Response(user_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE", "POST"])
def user_detail(request, pk=None):
    if pk is not None:
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == "GET":
            serializer = UserSerializer(user)
            return Response(serializer.data)

        elif request.method == "PUT":
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "PATCH":
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
