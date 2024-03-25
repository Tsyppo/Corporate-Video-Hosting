import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Video, ViewHistory, Comment
from .serializers import VideoSerializer, ViewHistorySerializer, CommentSerializer


@api_view(["GET", "POST"])
def video_list(request):
    if request.method == "POST":
        video_file = request.FILES.get("video")
        if video_file:
            # Сохраняем видео в облачное хранилище (Yandex Object Storage)
            video = Video.objects.create(
                title=request.data.get("title"),
                description=request.data.get("description"),
                video_url=video_file,  # Устанавливаем URL видео на загруженный файл
                status=request.data.get("status"),
            )
            serializer = VideoSerializer(video)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            {"error": "No video file provided"}, status=status.HTTP_400_BAD_REQUEST
        )
    elif request.method == "GET":
        videos = Video.objects.all()
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
def video_detail(request, pk):
    try:
        video = Video.objects.get(pk=pk)
    except Video.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = VideoSerializer(video)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = VideoSerializer(video, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        video.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def view_history_list(request):
    if request.method == "GET":
        queryset = ViewHistory.objects.all()
        serializer = ViewHistorySerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = ViewHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def view_history_detail(request, pk):
    try:
        view_history = ViewHistory.objects.get(pk=pk)
    except ViewHistory.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ViewHistorySerializer(view_history)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = ViewHistorySerializer(view_history, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        view_history.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def comment_list(request):
    if request.method == "GET":
        queryset = Comment.objects.all()
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def comment_detail(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)