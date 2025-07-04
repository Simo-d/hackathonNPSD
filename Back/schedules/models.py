from django.db import models
from django.conf import settings


class Course(models.Model):
    """Course/Subject model"""
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
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    credits = models.IntegerField(default=3)
    professor = models.CharField(max_length=100)
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES)
    filiere = models.CharField(max_length=10, choices=FILIERE_CHOICES)
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Schedule(models.Model):
    """Class schedule model"""
    DAYS_OF_WEEK = [
        ('MON', 'Lundi'),
        ('TUE', 'Mardi'),
        ('WED', 'Mercredi'),
        ('THU', 'Jeudi'),
        ('FRI', 'Vendredi'),
        ('SAT', 'Samedi'),
    ]
    
    TYPE_CHOICES = [
        ('COURSE', 'Cours'),
        ('TD', 'Travaux Dirigés'),
        ('TP', 'Travaux Pratiques'),
        ('EXAM', 'Examen'),
    ]
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=3, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='COURSE')
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='schedules')
    
    class Meta:
        ordering = ['day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.course.name} - {self.get_day_of_week_display()} {self.start_time}"


class Assignment(models.Model):
    """Homework/Assignment model"""
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('IN_PROGRESS', 'En cours'),
        ('COMPLETED', 'Terminé'),
        ('OVERDUE', 'En retard'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Faible'),
        ('MEDIUM', 'Moyenne'),
        ('HIGH', 'Élevée'),
        ('URGENT', 'Urgente'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    due_date = models.DateTimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    estimated_hours = models.FloatField(default=2.0)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.course.name}"


class Exam(models.Model):
    """Exam model"""
    TYPE_CHOICES = [
        ('MIDTERM', 'Contrôle continu'),
        ('FINAL', 'Examen final'),
        ('QUIZ', 'Quiz'),
        ('PRACTICAL', 'Examen pratique'),
    ]
    
    title = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    exam_date = models.DateTimeField()
    duration = models.DurationField()  # Duration in hours
    room = models.CharField(max_length=50)
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='exams')
    instructions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.course.name}"


class Reminder(models.Model):
    """Reminder/Notification model"""
    TYPE_CHOICES = [
        ('ASSIGNMENT', 'Devoir'),
        ('EXAM', 'Examen'),
        ('CLASS', 'Cours'),
        ('DEADLINE', 'Échéance'),
        ('CUSTOM', 'Personnalisé'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    message = models.TextField()
    reminder_type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    remind_at = models.DateTimeField()
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional references
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=True, blank=True)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return f"Rappel: {self.title} pour {self.student.username}"
