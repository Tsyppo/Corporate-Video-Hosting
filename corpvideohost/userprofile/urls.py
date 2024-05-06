from django.urls import path
from . import views

urlpatterns = [
    path("groups/", views.group_list, name="group_list"),
    path("groups/<int:pk>/", views.group_detail, name="group_detail"),
    path(
        "groups/<int:pk>/update-members-waiting/",
        views.update_group_waiting,
        name="update_group_waiting",
    ),
    path(
        "groups/<int:pk>/cancel-application/<int:userId>/",
        views.cancel_application,
        name="cancel_application",
    ),
    path(
        "groups/<int:pk>/add-to-members/", views.add_to_members, name="add_to_members"
    ),
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
