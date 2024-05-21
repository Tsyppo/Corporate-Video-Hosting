from django.test import TestCase
from django.utils import timezone
from .models import Group, Playlist, Analytics, UserProfile
from user.models import User
from video.models import Video


class GroupModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create(username="testuser")
        Group.objects.create(
            title="Test Group",
            description="Test description",
            creator=user,
        )

    def test_title_label(self):
        group = Group.objects.get(id=1)
        field_label = group._meta.get_field("title").verbose_name
        self.assertEqual(field_label, "title")

    def test_description_max_length(self):
        group = Group.objects.get(id=1)
        max_length = group._meta.get_field("description").max_length
        self.assertEqual(max_length, 100)

    # Add more tests as needed


class PlaylistModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create(username="testuser")
        group = Group.objects.create(
            title="Test Group",
            description="Test description",
            creator=user,
        )
        Playlist.objects.create(
            title="Test Playlist",
            group=group,
        )

    def test_title_label(self):
        playlist = Playlist.objects.get(id=1)
        field_label = playlist._meta.get_field("title").verbose_name
        self.assertEqual(field_label, "title")

    # Add more tests as needed


class AnalyticsModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create(username="testuser")
        video = Video.objects.create(title="Test Video", creator=user)
        Analytics.objects.create(
            user=user,
            video=video,
            view_date=timezone.now(),
            duration="10",
            full_duration="20",
            status="В процессе",
        )

    def test_view_date_auto_now_add(self):
        analytics = Analytics.objects.get(id=1)
        self.assertIsNotNone(analytics.view_date)

    # Add more tests as needed


class UserProfileModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username=f"testuser_{self._testMethodName}")

    def test_user_profile_creation(self):
        user_profile = UserProfile.objects.get(user=self.user)
        self.assertIsNotNone(user_profile)

    # Add more tests as needed
