from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from .models import Student, StudentProfile
from .serializers import (
    StudentRegistrationSerializer,
    StudentSerializer,
    StudentProfileSerializer,
    LoginSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        
        # Create profile
        StudentProfile.objects.create(
            student=student,
            enrollment_year=request.data.get('enrollment_year', 2024),
            expected_graduation=request.data.get('expected_graduation', 2027)
        )
        
        # Create token
        token, created = Token.objects.get_or_create(user=student)
        
        return Response({
            'token': token.key,
            'student': StudentSerializer(student).data,
            'message': 'Inscription réussie'
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    login(request, user)
    
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'student': StudentSerializer(user).data,
        'message': 'Connexion réussie'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    
    return Response({'message': 'Déconnexion réussie'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = StudentSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    serializer = StudentSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    
    return Response({
        'student': serializer.data,
        'message': 'Profil mis à jour avec succès'
    })
