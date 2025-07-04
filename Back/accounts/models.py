from django.contrib.auth.models import AbstractUser
from django.db import models


class Student(AbstractUser):
    """Extended user model for students"""
    LEVEL_CHOICES = [
        ('L1', 'Licence 1'),
        ('L2', 'Licence 2'),
        ('L3', 'Licence 3'),
        ('M1', 'Master 1'),
        ('M2', 'Master 2'),
    ]
    
    FILIERE_CHOICES = [
        ('INFO', 'Informatique'),
        ('MATH', 'Mathématiques'),
        ('PHYS', 'Physique'),
        ('ECON', 'Économie'),
        ('GESTION', 'Gestion'),
        ('DROIT', 'Droit'),
    ]
    
    student_id = models.CharField(max_length=20, unique=True)
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES)
    filiere = models.CharField(max_length=10, choices=FILIERE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True)
    
    # Preferences for AI matching
    study_preferences = models.JSONField(default=dict, blank=True)  # Study habits, preferred times, etc.
    interests = models.JSONField(default=list, blank=True)  # Academic interests
    availability = models.JSONField(default=dict, blank=True)  # Weekly availability
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} - {self.get_level_display()}"


class StudentProfile(models.Model):
    """Additional profile information for students"""
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='profile')
    
    # Academic information
    gpa = models.FloatField(null=True, blank=True)
    enrollment_year = models.IntegerField()
    expected_graduation = models.IntegerField()
    
    # Social preferences
    preferred_group_size = models.IntegerField(default=4)
    communication_preference = models.CharField(
        max_length=20,
        choices=[
            ('whatsapp', 'WhatsApp'),
            ('telegram', 'Telegram'),
            ('discord', 'Discord'),
            ('email', 'Email'),
        ],
        default='whatsapp'
    )
    
    # Emergency contact
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    
    def __str__(self):
        return f"Profile de {self.student.username}"
