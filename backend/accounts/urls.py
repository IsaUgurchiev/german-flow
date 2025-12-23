from django.urls import path
from .views import GoogleLoginView, MeView, StateView

urlpatterns = [
    path('auth/google', GoogleLoginView.as_view(), name='google-login'),
    path('me', MeView.as_view(), name='me'),
    path('state', StateView.as_view(), name='state'),
]

