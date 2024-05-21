from django.test import TestCase
from user.models import User


class MyModelTest(TestCase):
    def setUp(self):
        self.instance = User.objects.create(
            email="test@example.com", username="testuser", password="testpass", value=10
        )

    def test_increase_value(self):
        self.instance.increase_value(5)
        self.assertEqual(self.instance.value, 15)
