from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from user.models import User
from video.models import Video
from .models import Analytics, Group, Playlist, SearchHistory, UserProfile
from .serializers import (
    AnalyticsSerializer,
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
            user_id = request.data.get("creator")
            creator = User.objects.filter(id=user_id).first()
            if creator is not None:
                group = Group.objects.create(
                    title=request.data.get("title"),
                    description=request.data.get("description"),
                    status=request.data.get("status"),
                    creator=creator,
                )
                serializer = GroupSerializer(group)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "Serializer is no valid", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["GET", "PUT", "PATCH", "DELETE"])
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

    elif request.method == "PATCH":
        serializer = GroupSerializer(group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["PATCH"])
def update_group_waiting(request, pk):
    try:
        group = Group.objects.get(pk=pk)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PATCH":
        waiting = request.data.get("waiting", [])

        if waiting:
            group.waiting.add(*waiting)

        serializer = GroupSerializer(group)
        return Response(serializer.data)


@api_view(["PATCH"])
def cancel_application(request, pk, userId):
    try:
        group = Group.objects.get(pk=pk)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PATCH":
        # Получаем список пользователей ожидающих вступления в группу
        waiting_users = list(group.waiting.values_list("id", flat=True))

        # Проверяем, является ли пользователь одним из ожидающих вступления
        if userId in waiting_users:
            # Удаляем пользователя из списка ожидающих
            group.waiting.remove(userId)
            serializer = GroupSerializer(group)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
def add_to_members(request, pk):
    try:
        group = Group.objects.get(pk=pk)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PATCH":
        userId = request.data.get("userId")

        # Проверяем, что пользователь и группа существуют
        if userId is not None:
            # Добавляем пользователя в список members
            group.members.add(userId)
            serializer = GroupSerializer(group)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
def remove_from_members(request, pk):
    try:
        group = Group.objects.get(pk=pk)
    except Group.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "PATCH":
        userId = request.data.get("userId")

        if userId is not None:
            try:
                group.members.remove(userId)
                group.save()
                serializer = GroupSerializer(group)
                return Response(serializer.data)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
def playlist_list(request):
    if request.method == "GET":
        queryset = Playlist.objects.all()
        serializer = PlaylistSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        group_id = request.data.get("group")
        group = Group.objects.filter(id=group_id).first()

        if group:
            serializer = PlaylistSerializer(data=request.data)
            if serializer.is_valid():
                playlist = Playlist.objects.create(
                    title=request.data.get("title"),
                    status=request.data.get("status"),
                    group=group,
                )

                # Получаем список id видео из FormData
                video_ids = request.data.getlist("videos")
                for video_id in video_ids:
                    try:
                        video = Video.objects.get(id=int(video_id))
                        playlist.videos.add(video)
                    except Video.DoesNotExist:
                        print(f"Video with id {int(video_id)} does not exist.")

                serializer = PlaylistSerializer(playlist)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "Serializer is not valid"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"error": "Group not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


@api_view(["GET", "PUT", "PATCH", "DELETE"])
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

    elif request.method == "PATCH":
        serializer = PlaylistSerializer(playlist, data=request.data, partial=True)
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


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def user_profile_detail(request, pk):
    try:
        user_profile = UserProfile.objects.get(pk=pk)
    except UserProfile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    elif request.method == "PATCH":  # Изменили метод на PATCH
        # Получаем данные из запроса
        video_id = request.data.get(
            "videoId"
        )  # Предполагаем, что передается videoId в теле запроса
        if video_id:
            # Проверяем, есть ли video_id уже в списке избранных видео пользователя
            if user_profile.favorites.filter(id=video_id).exists():
                user_profile.favorites.remove(
                    video_id
                )  # Удаляем video_id из списка избранных
                user_profile.save()
                serializer = UserProfileSerializer(user_profile)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Если video_id не было в списке избранных, то добавляем его
                user_profile.favorites.add(video_id)
                user_profile.save()
                serializer = UserProfileSerializer(user_profile)
                return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("VideoId not provided", status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "PUT":
        serializer = UserProfileSerializer(user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        user_profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST", "PATCH", "DELETE"])
def analytics_list(request):
    if request.method == "GET":
        analytics = Analytics.objects.all()
        serializer = AnalyticsSerializer(analytics, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = AnalyticsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Выводим ошибки в консоль для дальнейшего анализа
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PATCH":
        try:
            analytic_id = request.data.get("id")
            analytic = Analytics.objects.get(id=analytic_id)
            serializer = AnalyticsSerializer(analytic, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Analytics.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == "DELETE":
        # Удаляем все записи аналитики
        Analytics.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Analytics
from .serializers import AnalyticsSerializer


@api_view(["PUT"])
def analytics_detail(request, pk):
    try:
        analytic = Analytics.objects.get(pk=pk)
    except Analytics.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Проверяем, что метод запроса - PATCH
    if request.method == "PUT":
        serializer = AnalyticsSerializer(analytic, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
