from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserState

class UserSerializer(serializers.ModelSerializer):
    displayName = serializers.SerializerMethodField()
    avatarUrl = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'displayName', 'avatarUrl')

    def get_displayName(self, obj):
        try:
            return obj.profile.display_name or ""
        except:
            return ""

    def get_avatarUrl(self, obj):
        try:
            return obj.profile.avatar_url or ""
        except:
            return ""

class UserStateSerializer(serializers.ModelSerializer):
    # Map snake_case to camelCase as requested in Step 5.2 payload
    totalXp = serializers.IntegerField(source='total_xp')
    xpLog = serializers.JSONField(source='xp_log')
    myWords = serializers.JSONField(source='my_words')
    exerciseAttempts = serializers.JSONField(source='exercise_attempts', default=list)
    lastLessonId = serializers.CharField(source='last_lesson_id', allow_null=True, allow_blank=True)

    class Meta:
        model = UserState
        fields = ('totalXp', 'xpLog', 'myWords', 'exerciseAttempts', 'lastLessonId')

class GoogleLoginSerializer(serializers.Serializer):
    idToken = serializers.CharField()

