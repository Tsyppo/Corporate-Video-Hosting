from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Group, Playlist, SearchHistory, UserProfile
from .serializers import (
    GroupSerializer,
    PlaylistSerializer,
    SearchHistorySerializer,
    UserProfileSerializer,
)


@api_view(["GET", "POST"])
def group_list(request):
    if request.method == "GET":
        queryset = Group.objects.all()
        serializer = GroupSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def group_detail(request, pk):
    try:
        group = Group.objects.get(pk=pk)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = GroupSerializer(group)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = GroupSerializer(group, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def playlist_list(request):
    if request.method == "GET":
        queryset = Playlist.objects.all()
        serializer = PlaylistSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def playlist_detail(request, pk):
    try:
        playlist = Playlist.objects.get(pk=pk)
    except Playlist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = PlaylistSerializer(playlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        playlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def search_history_list(request):
    if request.method == "GET":
        queryset = SearchHistory.objects.all()
        serializer = SearchHistorySerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = SearchHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def search_history_detail(request, pk):
    try:
        search_history = SearchHistory.objects.get(pk=pk)
    except SearchHistory.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = SearchHistorySerializer(search_history)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = SearchHistorySerializer(search_history, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        search_history.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def user_profile_list(request):
    if request.method == "GET":
        queryset = UserProfile.objects.all()
        serializer = UserProfileSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def user_profile_detail(request, pk):
    try:
        user_profile = UserProfile.objects.get(pk=pk)
    except UserProfile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserProfileSerializer(user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        user_profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)