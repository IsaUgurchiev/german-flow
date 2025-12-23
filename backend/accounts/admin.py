from django.contrib import admin
from .models import UserState, UserProfile

@admin.register(UserState)
class UserStateAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_xp', 'updated_at')
    search_fields = ('user__email', 'user__username')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'display_name', 'updated_at')
    search_fields = ('user__email', 'user__username', 'display_name')

