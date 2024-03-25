from django.db import models


class UserRole(models.TextChoices):
    ADMIN = "admin", "Admin"
    MODERATOR = "moderator", "Moderator"
    USER = "user", "User"


class UserStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    INACTIVE = "inactive", "Inactive"
    BANNED = "banned", "Banned"


class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    patronymic = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    role = models.CharField(
        max_length=20, choices=UserRole.choices, default=UserRole.USER
    )
    status = models.CharField(
        max_length=20, choices=UserStatus.choices, default=UserStatus.ACTIVE
    )


# {
#     "role": "user",
#     "status": "active",
#     "username": "example_user",
#     "first_name": "John",
#     "last_name": "Doe",
#     "patronymic": "Smith",
#     "phone_number": "+1234567890",
#     "email": "example@example.com",
# }
