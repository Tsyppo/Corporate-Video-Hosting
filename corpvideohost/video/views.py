import os
import subprocess
import sys
from yandex.cloud import storage
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from corpvideohost import settings
from user.models import User
from .models import Video, ViewHistory, Comment
from .serializers import VideoSerializer, ViewHistorySerializer, CommentSerializer

import boto3


@api_view(["GET", "POST"])
def user_video_list(request):
    if request.method == "GET":
        user_id = request.GET.get("user")
        if user_id is not None:
            videos = Video.objects.filter(creator_id=user_id)
            serializer = VideoSerializer(videos, many=True)
            return Response(serializer.data)
        else:
            return Response(
                {"error": "User ID not provided"}, status=status.HTTP_400_BAD_REQUEST
            )
    elif request.method == "POST":
        video_file = request.FILES.get("video")
        processed_folder_url = process_video(video_file)
        if processed_folder_url:
            # Получаем данные пользователя из запроса
            user_id = request.data.get("creator")
            # Ищем пользователя по его id
            creator = User.objects.filter(id=user_id).first()
            if creator is not None:
                video = Video.objects.create(
                    title=request.data.get("title"),
                    description=request.data.get("description"),
                    video=processed_folder_url,
                    status=request.data.get("status"),
                    creator=creator,
                )

                serializer = VideoSerializer(video)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "No video file provided"}, status=status.HTTP_400_BAD_REQUEST
            )


def create_folder_and_upload_files(local_folder_path, ycs_bucket_name, ycs_folder_name):
    # Инициализация клиента для работы с Yandex Object Storage
    client = boto3.client(
        "s3",
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_STORAGE_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_STORAGE_SECRET_ACCESS_KEY,
    )

    # Создание новой папки в YCS
    client.put_object(Bucket=ycs_bucket_name, Key=f"{ycs_folder_name}/")

    # Получение списка файлов в локальной папке
    local_files = os.listdir(local_folder_path)

    # Загрузка файлов из локальной папки в YCS
    for filename in local_files:
        local_file_path = os.path.join(local_folder_path, filename)
        ycs_file_path = f"{ycs_folder_name}/{filename}"
        client.upload_file(local_file_path, ycs_bucket_name, ycs_file_path)


def process_video(video_file):
    temp_directory = os.path.join("/tmp", "video_files")
    os.makedirs(temp_directory, exist_ok=True)

    # Получаем путь к файлу
    video_path = os.path.join(temp_directory, video_file.name)

    # Сохраняем файл на диск
    with open(video_path, "wb") as f:
        for chunk in video_file.chunks():
            f.write(chunk)

    print(video_file)
    # Получаем путь к текущему файлу
    current_file_path = os.path.abspath(__file__)
    # Получаем путь к директории, содержащей текущий файл
    current_directory = os.path.dirname(current_file_path)
    # Путь к директории, содержащей скрипт
    script_directory = os.path.join(current_directory, "..", "scripts")
    # Путь к скрипту
    script_path = os.path.join(script_directory, "script.py")

    name_without_extension = os.path.splitext(video_file.name)[0]
    print(name_without_extension)

    try:
        subprocess.run(["python", script_path, video_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Ошибка при выполнении скрипта: {e}")

    local_folder_path = f"C:\\Users\\ANTON\\Диплом\\Corporate-Video-Hosting\\corpvideohost\\scripts\\{name_without_extension}"

    # Имя бакета, куда будут загружены файлы
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    # Загрузка содержимого папки
    create_folder_and_upload_files(
        local_folder_path, bucket_name, name_without_extension
    )

    return f"{name_without_extension}"


@api_view(["GET"])
def all_video_list(request):
    if request.method == "GET":
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
        if "video_id" in request.query_params:
            queryset = Comment.objects.filter(video_id=request.query_params["video_id"])
        else:
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
