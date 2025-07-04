from django.db import models
from django.conf import settings
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd


class StudyGroup(models.Model):
    """Study group model"""
    STATUS_CHOICES = [
        ('FORMING', 'En formation'),
        ('ACTIVE', 'Actif'),
        ('COMPLETED', 'Terminé'),
        ('CANCELLED', 'Annulé'),
    ]
    
    STUDY_TYPE_CHOICES = [
        ('EXAM_PREP', 'Préparation d\'examen'),
        ('HOMEWORK', 'Devoirs'),
        ('PROJECT', 'Projet'),
        ('GENERAL', 'Étude générale'),
    ]
    
    FREQUENCY_CHOICES = [
        ('DAILY', 'Quotidien'),
        ('WEEKLY', 'Hebdomadaire'),
        ('BIWEEKLY', 'Bi-hebdomadaire'),
        ('MONTHLY', 'Mensuel'),
    ]
    
    TIME_CHOICES = [
        ('MORNING', 'Matin'),
        ('AFTERNOON', 'Après-midi'),
        ('EVENING', 'Soir'),
        ('FLEXIBLE', 'Flexible'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    course = models.ForeignKey('schedules.Course', on_delete=models.CASCADE)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='GroupMembership', related_name='study_groups')
    max_members = models.IntegerField(default=6)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='FORMING')
    
    # Study preferences
    study_type = models.CharField(max_length=50, choices=STUDY_TYPE_CHOICES)
    meeting_frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    preferred_time = models.CharField(max_length=20, choices=TIME_CHOICES)
    
    # AI matching score
    avg_compatibility_score = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.course.name}"
    
    @property
    def is_full(self):
        return self.members.count() >= self.max_members
    
    @property
    def available_spots(self):
        return max(0, self.max_members - self.members.count())


class GroupMembership(models.Model):
    """Group membership with additional info"""
    ROLE_CHOICES = [
        ('CREATOR', 'Créateur'),
        ('MODERATOR', 'Modérateur'),
        ('MEMBER', 'Membre'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    contribution_score = models.FloatField(default=0.0)  # Based on activity
    
    class Meta:
        unique_together = ('student', 'group')
    
    def __str__(self):
        return f"{self.student.username} in {self.group.name}"


class MatchingRequest(models.Model):
    """Request for AI matching to find study partners"""
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('PROCESSING', 'En cours'),
        ('COMPLETED', 'Terminé'),
        ('EXPIRED', 'Expiré'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey('schedules.Course', on_delete=models.CASCADE)
    preferred_group_size = models.IntegerField(default=4)
    study_type = models.CharField(max_length=50, choices=StudyGroup.STUDY_TYPE_CHOICES)
    availability = models.JSONField(default=dict)  # Weekly availability
    preferences = models.JSONField(default=dict)  # Study preferences
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    
    # Matching results
    matched_groups = models.ManyToManyField(StudyGroup, blank=True)
    compatibility_scores = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"Demande de {self.student.username} pour {self.course.name}"


class StudentCompatibility(models.Model):
    """Pre-calculated compatibility scores between students"""
    student1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='compatibility_as_student1')
    student2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='compatibility_as_student2')
    course = models.ForeignKey('schedules.Course', on_delete=models.CASCADE)
    compatibility_score = models.FloatField()
    
    # Detailed compatibility factors
    schedule_compatibility = models.FloatField(default=0.0)
    academic_compatibility = models.FloatField(default=0.0)
    personality_compatibility = models.FloatField(default=0.0)
    preference_compatibility = models.FloatField(default=0.0)
    
    calculated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('student1', 'student2', 'course')
    
    def __str__(self):
        return f"{self.student1.username} <-> {self.student2.username}: {self.compatibility_score:.2f}"


class MatchingAlgorithm:
    """AI-powered matching algorithm"""
    
    @staticmethod
    def calculate_compatibility(student1, student2, course):
        """Calculate compatibility score between two students"""
        scores = {}
        
        # Schedule compatibility (40% weight)
        scores['schedule'] = MatchingAlgorithm._calculate_schedule_compatibility(student1, student2)
        
        # Academic compatibility (30% weight)
        scores['academic'] = MatchingAlgorithm._calculate_academic_compatibility(student1, student2)
        
        # Personality/preferences compatibility (20% weight)
        scores['personality'] = MatchingAlgorithm._calculate_personality_compatibility(student1, student2)
        
        # Communication preferences (10% weight)
        scores['communication'] = MatchingAlgorithm._calculate_communication_compatibility(student1, student2)
        
        # Weighted average
        total_score = (
            scores['schedule'] * 0.4 +
            scores['academic'] * 0.3 +
            scores['personality'] * 0.2 +
            scores['communication'] * 0.1
        )
        
        return total_score, scores
    
    @staticmethod
    def _calculate_schedule_compatibility(student1, student2):
        """Calculate schedule overlap compatibility"""
        avail1 = student1.availability or {}
        avail2 = student2.availability or {}
        
        if not avail1 or not avail2:
            return 0.5  # Neutral score if no availability data
        
        # Calculate overlap in available time slots
        overlap_score = 0
        total_slots = 0
        
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']:
            slots1 = avail1.get(day, [])
            slots2 = avail2.get(day, [])
            
            if slots1 and slots2:
                # Simple overlap calculation
                overlap = len(set(slots1) & set(slots2))
                total = len(set(slots1) | set(slots2))
                if total > 0:
                    overlap_score += overlap / total
                total_slots += 1
        
        return overlap_score / max(total_slots, 1)
    
    @staticmethod
    def _calculate_academic_compatibility(student1, student2):
        """Calculate academic level compatibility"""
        # Same level is better
        level_score = 1.0 if student1.level == student2.level else 0.7
        
        # Same filiere is better
        filiere_score = 1.0 if student1.filiere == student2.filiere else 0.8
        
        # GPA compatibility (if available)
        gpa_score = 1.0
        try:
            gpa1 = getattr(student1.profile, 'gpa', 0) or 0
            gpa2 = getattr(student2.profile, 'gpa', 0) or 0
            if gpa1 > 0 and gpa2 > 0:
                gpa_diff = abs(gpa1 - gpa2)
                gpa_score = max(0, 1 - gpa_diff / 4.0)  # Assuming GPA out of 4
        except:
            pass
        
        return (level_score * 0.4 + filiere_score * 0.3 + gpa_score * 0.3)
    
    @staticmethod
    def _calculate_personality_compatibility(student1, student2):
        """Calculate personality and study preferences compatibility"""
        prefs1 = student1.study_preferences or {}
        prefs2 = student2.study_preferences or {}
        
        if not prefs1 or not prefs2:
            return 0.7  # Neutral score
        
        compatibility = 0
        factors = 0
        
        # Study style compatibility
        style1 = prefs1.get('study_style')
        style2 = prefs2.get('study_style')
        if style1 and style2:
            compatibility += 1.0 if style1 == style2 else 0.5
            factors += 1
        
        # Group size preference
        size1 = prefs1.get('preferred_group_size', 4)
        size2 = prefs2.get('preferred_group_size', 4)
        size_diff = abs(size1 - size2)
        compatibility += max(0, 1 - size_diff / 4)
        factors += 1
        
        return compatibility / max(factors, 1)
    
    @staticmethod
    def _calculate_communication_compatibility(student1, student2):
        """Calculate communication preferences compatibility"""
        try:
            comm1 = getattr(student1.profile, 'communication_preference', 'whatsapp')
            comm2 = getattr(student2.profile, 'communication_preference', 'whatsapp')
            return 1.0 if comm1 == comm2 else 0.7
        except:
            return 0.8  # Neutral score
    
    @staticmethod
    def find_optimal_groups(students, course, group_size=4):
        """Use clustering to form optimal study groups"""
        if len(students) < 2:
            return []
        
        # Create feature matrix
        features = []
        student_list = list(students)
        
        for student in student_list:
            feature_vector = MatchingAlgorithm._create_feature_vector(student)
            features.append(feature_vector)
        
        # Only proceed if we have scikit-learn available
        try:
            # Normalize features
            scaler = StandardScaler()
            features_scaled = scaler.fit_transform(features)
            
            # Determine number of clusters
            n_groups = max(1, len(students) // group_size)
            
            # Apply K-means clustering
            kmeans = KMeans(n_clusters=n_groups, random_state=42)
            cluster_labels = kmeans.fit_predict(features_scaled)
            
            # Group students by cluster
            groups = {}
            for i, label in enumerate(cluster_labels):
                if label not in groups:
                    groups[label] = []
                groups[label].append(student_list[i])
            
            return list(groups.values())
        except ImportError:
            # Fallback to simple grouping if scikit-learn is not available
            return [student_list[i:i+group_size] for i in range(0, len(student_list), group_size)]
    
    @staticmethod
    def _create_feature_vector(student):
        """Create numerical feature vector for clustering"""
        features = []
        
        # Level encoding
        level_encoding = {'L1': 1, 'L2': 2, 'L3': 3, 'M1': 4, 'M2': 5}
        features.append(level_encoding.get(student.level, 3))
        
        # Filiere encoding
        filiere_encoding = {'INFO': 1, 'MATH': 2, 'PHYS': 3, 'ECON': 4, 'GESTION': 5, 'DROIT': 6}
        features.append(filiere_encoding.get(student.filiere, 1))
        
        # GPA (if available)
        try:
            gpa = getattr(student.profile, 'gpa', 2.5) or 2.5
        except:
            gpa = 2.5
        features.append(gpa)
        
        # Study preferences
        prefs = student.study_preferences or {}
        features.append(prefs.get('preferred_group_size', 4))
        
        # Time preferences (encoded as numbers)
        time_pref = prefs.get('preferred_study_time', 'afternoon')
        time_encoding = {'morning': 1, 'afternoon': 2, 'evening': 3, 'flexible': 2}
        features.append(time_encoding.get(time_pref, 2))
        
        return features
