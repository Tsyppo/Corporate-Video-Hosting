from django.urls import path
from . import views

urlpatterns = [
    path("users/", views.user_list, name="user_list"),
    path("users/<int:pk>/", views.user_detail, name="user_detail"),
    path("login/", views.user_login, name="login"),
    path("check_token/", views.check_token, name="login"),
]
