from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Student, StudentProfile


class StudentSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'student_id', 'level', 'filiere', 'phone_number', 'birth_date',
            'address', 'profile_picture', 'study_preferences', 'interests',
            'availability', 'created_at', 'updated_at', 'profile'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_profile(self, obj):
        try:
            profile = obj.profile
            return {
                'gpa': profile.gpa,
                'enrollment_year': profile.enrollment_year,
                'expected_graduation': profile.expected_graduation,
                'preferred_group_size': profile.preferred_group_size,
                'communication_preference': profile.communication_preference,
                'emergency_contact_name': profile.emergency_contact_name,
                'emergency_contact_phone': profile.emergency_contact_phone,
            }
        except StudentProfile.DoesNotExist:
            return None


class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    enrollment_year = serializers.IntegerField()
    expected_graduation = serializers.IntegerField()
    
    class Meta:
        model = Student
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'student_id', 'level', 'filiere',
            'phone_number', 'enrollment_year', 'expected_graduation'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm and profile data
        password_confirm = validated_data.pop('password_confirm')
        enrollment_year = validated_data.pop('enrollment_year')
        expected_graduation = validated_data.pop('expected_graduation')
        
        # Create student
        student = Student.objects.create_user(**validated_data)
        
        # Create profile
        StudentProfile.objects.create(
            student=student,
            enrollment_year=enrollment_year,
            expected_graduation=expected_graduation
        )
        
        return student


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs


class ProfileUpdateSerializer(serializers.ModelSerializer):
    profile = serializers.JSONField(required=False)
    
    class Meta:
        model = Student
        fields = [
            'first_name', 'last_name', 'phone_number', 'birth_date',
            'address', 'study_preferences', 'interests', 'availability', 'profile'
        ]
    
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        # Update student fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update profile if provided
        if profile_data:
            profile, created = StudentProfile.objects.get_or_create(student=instance)
            for attr, value in profile_data.items():
                if hasattr(profile, attr):
                    setattr(profile, attr, value)
            profile.save()
        
        return instance


# Alias for compatibility
StudentProfileSerializer = ProfileUpdateSerializer
