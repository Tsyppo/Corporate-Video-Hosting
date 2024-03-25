from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("user.urls")),
    path("api/", include("userprofile.urls")),
    path("api/", include("video.urls")),
]
