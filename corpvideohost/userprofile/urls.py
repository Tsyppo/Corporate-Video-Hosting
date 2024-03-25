from django.urls import path
from . import views

urlpatterns = [
    path("groups/", views.group_list, name="group_list"),
    path("groups/<int:pk>/", views.group_detail, name="group_detail"),
    path("playlists/", views.playlist_list, name="playlist_list"),
    path("playlists/<int:pk>/", views.playlist_detail, name="playlist_detail"),
    path("searchhistory/", views.search_history_list, name="search_history_list"),
    path(
        "searchhistory/<int:pk>/",
        views.search_history_detail,
        name="search_history_detail",
    ),
    path("userprofiles/", views.user_profile_list, name="user_profile_list"),
    path(
        "userprofiles/<int:pk>/", views.user_profile_detail, name="user_profile_detail"
    ),
]
