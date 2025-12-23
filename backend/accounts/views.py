import os
from django.contrib.auth.models import User
from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from .serializers import UserSerializer, GoogleLoginSerializer, UserStateSerializer
from .models import UserState

class GoogleLoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['idToken']
        
        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            client_id = os.getenv('GOOGLE_CLIENT_ID')
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)

            # ID token is valid. Get the user's Google ID from the decoded token.
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            
            # Create or fetch user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email, # Use email as username for simplicity
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )

            # Ensure UserState exists
            UserState.objects.get_or_create(user=user)
            
            # Issue JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'accessToken': str(refresh.access_token),
                'user': UserSerializer(user).data
            })

        except ValueError:
            # Invalid token
            return Response(
                {'error': 'Invalid Google ID token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class StateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        state, created = UserState.objects.get_or_create(user=request.user)
        serializer = UserStateSerializer(state)
        return Response(serializer.data)

    def post(self, request):
        state, created = UserState.objects.get_or_create(user=request.user)
        serializer = UserStateSerializer(state, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

