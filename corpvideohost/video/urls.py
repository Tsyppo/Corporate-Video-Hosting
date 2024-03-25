from django.urls import path
from . import views

urlpatterns = [
    path("videos/", views.video_list, name="video_list"),
    path("videos/<int:pk>/", views.video_detail, name="video_detail"),
    path("viewhistory/", views.view_history_list, name="view_history_list"),
    path(
        "viewhistory/<int:pk>/", views.view_history_detail, name="view_history_detail"
    ),
    path("comments/", views.comment_list, name="comment_list"),
    path("comments/<int:pk>/", views.comment_detail, name="comment_detail"),
]
