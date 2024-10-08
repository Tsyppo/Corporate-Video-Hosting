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
    path(
        "groups/<int:pk>/remove-from-members/",
        views.remove_from_members,
        name="remove_from_members",
    ),
    path("playlists/", views.playlist_list, name="playlist_list"),
    path("playlists/<int:pk>/", views.playlist_detail, name="playlist_detail"),
    path("userprofiles/", views.user_profile_list, name="user_profile_list"),
    path(
        "userprofiles/<int:pk>/", views.user_profile_detail, name="user_profile_detail"
    ),
    path("analytics/", views.analytics_list, name="analytics_list"),
    path("analytics/<int:pk>/", views.analytics_detail, name="analytics_detail"),
]
