from django.contrib import admin
from .models import Student, StudentProfile

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'student_id', 'level', 'filiere']
    list_filter = ['level', 'filiere', 'is_active']
    search_fields = ['username', 'email', 'student_id', 'first_name', 'last_name']

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['student', 'gpa', 'enrollment_year', 'expected_graduation']
    list_filter = ['enrollment_year', 'expected_graduation']
