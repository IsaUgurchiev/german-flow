from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserState

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserStateSerializer(serializers.ModelSerializer):
    # Map snake_case to camelCase as requested in Step 5.2 payload
    totalXp = serializers.IntegerField(source='total_xp')
    xpLog = serializers.JSONField(source='xp_log')
    myWords = serializers.JSONField(source='my_words')
    lastLessonId = serializers.CharField(source='last_lesson_id', allow_null=True, allow_blank=True)

    class Meta:
        model = UserState
        fields = ('totalXp', 'xpLog', 'myWords', 'lastLessonId')

class GoogleLoginSerializer(serializers.Serializer):
    idToken = serializers.CharField()

