from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Student, StudentProfile


class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Student
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'student_id', 'level', 'filiere',
            'phone_number', 'birth_date', 'address'
        ]
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        student = Student.objects.create_user(**validated_data)
        student.set_password(password)
        student.save()
        return student


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    profile = StudentProfileSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'student_id', 'level', 'filiere', 'phone_number',
            'birth_date', 'address', 'profile_picture', 'profile',
            'study_preferences', 'interests', 'availability'
        ]
        read_only_fields = ['id', 'username']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Identifiants invalides.")
            if not user.is_active:
                raise serializers.ValidationError("Compte désactivé.")
            data['user'] = user
        else:
            raise serializers.ValidationError("Nom d'utilisateur et mot de passe requis.")
        
        return data
