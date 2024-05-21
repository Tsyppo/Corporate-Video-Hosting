from django.test import TestCase
from django.utils import timezone
from .models import Video, VideoStatus, Comment, ViewHistory
from user.models import User
from datetime import timedelta
import factory
from django.test import TestCase
from django.utils import timezone
from userprofile.models import Group, Playlist, Analytics, UserProfile


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")


class VideoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Video

    title = factory.Sequence(lambda n: f"Test Video {n}")
    description = "Test description"
    upload_date = timezone.now()
    status = VideoStatus.UNLISTED
    creator = factory.SubFactory(UserFactory)


class VideoModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create(username="testuser")

    def setUp(self):
        self.video = Video.objects.create(
            title="Test Video",
            description="Test description",
            upload_date=timezone.now(),
            status=VideoStatus.PUBLIC,
            creator=self.user,
        )

    def test_title_label(self):
        video = VideoFactory()
        field_label = video._meta.get_field("title").verbose_name
        self.assertEqual(field_label, "title")

    def test_description_max_length(self):
        video = VideoFactory(description="A" * 100)
        max_length = video._meta.get_field("description").max_length
        self.assertEqual(max_length, 1000)

    def test_video_status_default(self):
        video = VideoFactory()
        self.assertEqual(video.status, VideoStatus.UNLISTED)

    def test_creator_related_name(self):
        self.assertIn(self.video, self.user.created_videos.all())

    def test_video_str_method(self):
        expected_str = "Test Video"
        self.assertEqual(str(self.video), expected_str)

    def test_view_history_creation(self):
        # Assuming a user viewed the video
        user = UserFactory()
        self.video.users.add(user)
        self.assertEqual(self.video.viewhistory_set.count(), 1)

    def test_comment_creation(self):
        # Assuming a comment is created for the video
        comment = self.video.comment_video.create(
            text="Test Comment",
            user=self.user,
        )
        self.assertEqual(self.video.comment_video.count(), 1)
        self.assertEqual(comment.video, self.video)

    def test_parent_comment(self):
        # Assuming a parent comment and a reply are created for the video
        parent_comment = self.video.comment_video.create(
            text="Parent Comment",
            user=self.user,
        )
        reply = self.video.comment_video.create(
            text="Reply",
            user=self.user,
            parent_comment=parent_comment,
        )
        self.assertEqual(reply.parent_comment, parent_comment)


class IntegrationTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Создание пользователя
        cls.user = UserFactory()

        # Создание видео
        cls.video = VideoFactory(creator=cls.user)

        # Создание группы
        cls.group = Group.objects.create(
            title="Test Group",
            description="Test description",
            status="public",
            creator=cls.user,
        )
        cls.group.members.add(cls.user)
        cls.group.videos.add(cls.video)

        # Создание плейлиста
        cls.playlist = Playlist.objects.create(
            title="Test Playlist",
            status="public",
            group=cls.group,
        )
        cls.playlist.videos.add(cls.video)

        # Создание аналитики
        cls.analytics = Analytics.objects.create(
            user=cls.user,
            video=cls.video,
            view_date=timezone.now(),
            duration="10",
            full_duration="20",
            status="Completed",
        )

        # Создание профиля пользователя
        cls.user_profile, created = UserProfile.objects.get_or_create(
            user=cls.user,
        )
        cls.user_profile.favorites.add(cls.video)
        cls.user_profile.groups.add(cls.group)
        cls.user_profile.playlists.add(cls.playlist)

        # Создание истории просмотров
        cls.view_history = ViewHistory.objects.create(
            user=cls.user, video=cls.video, viewed_date=timezone.now()
        )

        # Создание комментария
        cls.comment = Comment.objects.create(
            text="Great video!",
            liked_by_user=True,
            likes_count=1,
            user=cls.user,
            video=cls.video,
        )

    def test_group_creation(self):
        self.assertEqual(self.group.creator, self.user)
        self.assertIn(self.user, self.group.members.all())
        self.assertIn(self.video, self.group.videos.all())

    def test_playlist_creation(self):
        self.assertEqual(self.playlist.group, self.group)
        self.assertIn(self.video, self.playlist.videos.all())

    def test_analytics_creation(self):
        self.assertEqual(self.analytics.user, self.user)
        self.assertEqual(self.analytics.video, self.video)
        self.assertEqual(self.analytics.status, "Completed")

    def test_user_profile_creation(self):
        self.assertEqual(self.user_profile.user, self.user)
        self.assertIn(self.video, self.user_profile.favorites.all())
        self.assertIn(self.group, self.user_profile.groups.all())
        self.assertIn(self.playlist, self.user_profile.playlists.all())

    def test_view_history_creation(self):
        self.assertEqual(self.view_history.user, self.user)
        self.assertEqual(self.view_history.video, self.video)

    def test_comment_creation(self):
        self.assertEqual(self.comment.user, self.user)
        self.assertEqual(self.comment.video, self.video)
        self.assertEqual(self.comment.text, "Great video!")
        self.assertTrue(self.comment.liked_by_user)
        self.assertEqual(self.comment.likes_count, 1)

    def test_complete_flow(self):
        # Проверка всех взаимодействий в одном тесте
        self.assertEqual(self.group.creator, self.user)
        self.assertIn(self.user, self.group.members.all())
        self.assertEqual(self.playlist.group, self.group)
        self.assertIn(self.video, self.playlist.videos.all())
        self.assertEqual(self.analytics.user, self.user)
        self.assertEqual(self.analytics.video, self.video)
        self.assertEqual(self.analytics.status, "Completed")
        self.assertEqual(self.user_profile.user, self.user)
        self.assertIn(self.video, self.user_profile.favorites.all())
        self.assertIn(self.group, self.user_profile.groups.all())
        self.assertIn(self.playlist, self.user_profile.playlists.all())
        self.assertEqual(self.view_history.user, self.user)
        self.assertEqual(self.view_history.video, self.video)
        self.assertEqual(self.comment.user, self.user)
        self.assertEqual(self.comment.video, self.video)
        self.assertEqual(self.comment.text, "Great video!")
        self.assertTrue(self.comment.liked_by_user)
        self.assertEqual(self.comment.likes_count, 1)
