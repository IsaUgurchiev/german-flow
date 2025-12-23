from django.db import models
from django.contrib.auth.models import User

class UserState(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='state')
    total_xp = models.IntegerField(default=0)
    xp_log = models.JSONField(default=list)
    my_words = models.JSONField(default=list)
    last_lesson_id = models.CharField(max_length=255, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"State for {self.user.username}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=255, blank=True, default="")
    avatar_url = models.URLField(max_length=1024, blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

