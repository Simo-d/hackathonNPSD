from django.db import models
from django.conf import settings


class Forum(models.Model):
    """Student forum for discussions"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)
    
    # Access control
    is_public = models.BooleanField(default=True)
    allowed_levels = models.JSONField(default=list, blank=True)  # L1, L2, etc.
    allowed_filieres = models.JSONField(default=list, blank=True)  # INFO, MATH, etc.
    
    moderators = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='moderated_forums', 
        blank=True
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    
    @property
    def post_count(self):
        return self.topics.aggregate(
            total=models.Count('posts')
        )['total'] or 0
    
    @property
    def topic_count(self):
        return self.topics.count()


class ForumTopic(models.Model):
    """Forum discussion topics"""
    TOPIC_TYPES = [
        ('QUESTION', 'Question'),
        ('DISCUSSION', 'Discussion'),
        ('ANNOUNCEMENT', 'Annonce'),
        ('STUDY_GROUP', 'Groupe d\'étude'),
        ('RESOURCE', 'Ressource'),
        ('EVENT', 'Événement'),
    ]
    
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=200)
    content = models.TextField()
    topic_type = models.CharField(max_length=15, choices=TOPIC_TYPES, default='DISCUSSION')
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Status
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    is_solved = models.BooleanField(default=False)  # For questions
    
    # Engagement
    views_count = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)
    
    # Tags
    tags = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def post_count(self):
        return self.posts.count()
    
    @property
    def last_post(self):
        return self.posts.order_by('-created_at').first()
    
    class Meta:
        ordering = ['-is_pinned', '-last_activity']


class ForumPost(models.Model):
    """Posts within forum topics"""
    topic = models.ForeignKey(ForumTopic, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    
    # For replies
    parent_post = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    # Status
    is_solution = models.BooleanField(default=False)  # Marked as solution for questions
    is_edited = models.BooleanField(default=False)
    
    # Engagement
    likes_count = models.PositiveIntegerField(default=0)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, through='PostLike', related_name='liked_posts')
    
    # Attachments
    attachments = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Post par {self.author.username} dans {self.topic.title}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update topic's last activity
        self.topic.last_activity = self.created_at
        self.topic.save(update_fields=['last_activity'])
    
    class Meta:
        ordering = ['created_at']


class PostLike(models.Model):
    """Likes on forum posts"""
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post', 'user')


class Event(models.Model):
    """Student events"""
    EVENT_TYPES = [
        ('ACADEMIC', 'Académique'),
        ('SOCIAL', 'Social'),
        ('STUDY_SESSION', 'Session d\'étude'),
        ('WORKSHOP', 'Atelier'),
        ('CONFERENCE', 'Conférence'),
        ('CULTURAL', 'Culturel'),
        ('SPORTS', 'Sport'),
        ('OTHER', 'Autre'),
    ]
    
    STATUS_CHOICES = [
        ('DRAFT', 'Brouillon'),
        ('PUBLISHED', 'Publié'),
        ('CANCELLED', 'Annulé'),
        ('COMPLETED', 'Terminé'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=15, choices=EVENT_TYPES)
    
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events')
    attendees = models.ManyToManyField(settings.AUTH_USER_MODEL, through='EventAttendance', related_name='events')
    
    # Date and location
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    location = models.CharField(max_length=200)
    online_link = models.URLField(blank=True)
    
    # Capacity and registration
    max_attendees = models.IntegerField(null=True, blank=True)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    requires_approval = models.BooleanField(default=False)
    
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='DRAFT')
    
    # Additional info
    tags = models.JSONField(default=list, blank=True)
    cover_image = models.ImageField(upload_to='events/', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def is_full(self):
        if not self.max_attendees:
            return False
        return self.attendees.count() >= self.max_attendees
    
    @property
    def available_spots(self):
        if not self.max_attendees:
            return None
        return max(0, self.max_attendees - self.attendees.count())
    
    class Meta:
        ordering = ['start_datetime']


class EventAttendance(models.Model):
    """Event attendance tracking"""
    STATUS_CHOICES = [
        ('REGISTERED', 'Inscrit'),
        ('CONFIRMED', 'Confirmé'),
        ('ATTENDED', 'Présent'),
        ('ABSENT', 'Absent'),
        ('CANCELLED', 'Annulé'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    attendee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='REGISTERED')
    
    registered_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    check_in_time = models.DateTimeField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.attendee.username} - {self.event.title}"
    
    class Meta:
        unique_together = ('event', 'attendee')


class StudySession(models.Model):
    """Organized study sessions"""
    SESSION_TYPES = [
        ('GROUP_STUDY', 'Étude en groupe'),
        ('TUTORING', 'Tutorat'),
        ('EXAM_PREP', 'Préparation examen'),
        ('PROJECT_WORK', 'Travail de projet'),
        ('HOMEWORK_HELP', 'Aide aux devoirs'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    session_type = models.CharField(max_length=15, choices=SESSION_TYPES)
    
    course = models.ForeignKey('schedules.Course', on_delete=models.CASCADE)
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_sessions')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='study_sessions')
    
    # Schedule
    datetime = models.DateTimeField()
    duration = models.DurationField()
    location = models.CharField(max_length=200)
    online_link = models.URLField(blank=True)
    
    # Capacity
    max_participants = models.IntegerField(default=6)
    
    # Content
    topics = models.JSONField(default=list, blank=True)
    resources = models.JSONField(default=list, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.course.name}"
    
    @property
    def is_full(self):
        return self.participants.count() >= self.max_participants
    
    @property
    def available_spots(self):
        return max(0, self.max_participants - self.participants.count())


class TipShare(models.Model):
    """Student tips and good deals sharing"""
    TIP_CATEGORIES = [
        ('FOOD', 'Restauration'),
        ('HOUSING', 'Logement'),
        ('TRANSPORT', 'Transport'),
        ('BOOKS', 'Livres/Fournitures'),
        ('ENTERTAINMENT', 'Loisirs'),
        ('SERVICES', 'Services'),
        ('ACADEMIC', 'Académique'),
        ('OTHER', 'Autre'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=15, choices=TIP_CATEGORIES)
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Location/availability
    location = models.CharField(max_length=100, blank=True)
    valid_until = models.DateField(null=True, blank=True)
    
    # Engagement
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='verified_tips'
    )
    
    tags = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def score(self):
        return self.upvotes - self.downvotes
    
    class Meta:
        # Fixed: removed ordering by 'score' since it's a property, not a field
        ordering = ['-created_at']


class TipVote(models.Model):
    """Votes on tips"""
    VOTE_CHOICES = [
        ('UP', 'Upvote'),
        ('DOWN', 'Downvote'),
    ]
    
    tip = models.ForeignKey(TipShare, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vote_type = models.CharField(max_length=4, choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('tip', 'user')


class Poll(models.Model):
    """Student polls for feedback and decisions"""
    question = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Options stored as JSON
    options = models.JSONField(default=list)  # [{"text": "Option 1", "votes": 0}, ...]
    
    # Settings
    allows_multiple_choices = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    
    # Dates
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Visibility
    is_public = models.BooleanField(default=True)
    target_levels = models.JSONField(default=list, blank=True)
    target_filieres = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return self.question
    
    @property
    def total_votes(self):
        return sum(option.get('votes', 0) for option in self.options)
    
    @property
    def is_expired(self):
        if not self.expires_at:
            return False
        from django.utils import timezone
        return timezone.now() > self.expires_at


class PollVote(models.Model):
    """Individual poll votes"""
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='poll_votes')
    voter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    selected_options = models.JSONField(default=list)  # List of option indices
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('poll', 'voter')


class Notification(models.Model):
    """General notifications for students"""
    NOTIFICATION_TYPES = [
        ('FORUM_REPLY', 'Réponse forum'),
        ('EVENT_REMINDER', 'Rappel événement'),
        ('STUDY_SESSION', 'Session d\'étude'),
        ('TIP_RESPONSE', 'Réponse à astuce'),
        ('POLL_CREATED', 'Nouveau sondage'),
        ('GROUP_INVITE', 'Invitation groupe'),
        ('SYSTEM', 'Système'),
    ]
    
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Optional links
    link_url = models.URLField(blank=True)
    link_text = models.CharField(max_length=50, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    is_important = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Notification pour {self.recipient.username}: {self.title}"
    
    class Meta:
        ordering = ['-created_at']
