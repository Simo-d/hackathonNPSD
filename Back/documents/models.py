from django.db import models
from django.conf import settings
from datetime import datetime, timedelta


class DocumentCategory(models.Model):
    """Categories for organizing documents"""
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='📄')
    color = models.CharField(max_length=7, default='#3B82F6')
    is_system = models.BooleanField(default=False)  # System-defined categories
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Document Categories"


class Document(models.Model):
    """Student documents storage"""
    DOCUMENT_TYPES = [
        ('INSCRIPTION', 'Inscription'),
        ('CERTIFICAT', 'Certificat'),
        ('RELEVE', 'Relevé de notes'),
        ('ATTESTATION', 'Attestation'),
        ('CARTE_ETUDIANT', 'Carte étudiant'),
        ('CONVENTION', 'Convention de stage'),
        ('ASSURANCE', 'Assurance'),
        ('LOGEMENT', 'Logement'),
        ('BOURSE', 'Bourse'),
        ('MEDICAL', 'Médical'),
        ('TRANSPORT', 'Transport'),
        ('OTHER', 'Autre'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Actif'),
        ('EXPIRED', 'Expiré'),
        ('PENDING', 'En attente'),
        ('REJECTED', 'Rejeté'),
        ('ARCHIVED', 'Archivé'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    category = models.ForeignKey(DocumentCategory, on_delete=models.SET_NULL, null=True)
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/%Y/%m/')
    file_size = models.PositiveIntegerField(default=0)  # in bytes
    file_type = models.CharField(max_length=10, blank=True)  # pdf, jpg, etc.
    
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Dates
    issue_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Metadata
    tags = models.JSONField(default=list, blank=True)
    is_official = models.BooleanField(default=False)
    issuing_authority = models.CharField(max_length=100, blank=True)
    reference_number = models.CharField(max_length=50, blank=True)
    
    # Sharing - Fixed the through_fields issue
    shared_with = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        through='DocumentShare', 
        through_fields=('document', 'shared_with'),
        related_name='shared_documents'
    )
    
    def __str__(self):
        return f"{self.title} - {self.student.username}"
    
    @property
    def is_expired(self):
        if not self.expiry_date:
            return False
        return self.expiry_date < datetime.now().date()
    
    @property
    def expires_soon(self):
        if not self.expiry_date:
            return False
        return self.expiry_date <= (datetime.now().date() + timedelta(days=30))
    
    def save(self, *args, **kwargs):
        if self.file:
            self.file_size = self.file.size
            self.file_type = self.file.name.split('.')[-1].lower()
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']


class DocumentShare(models.Model):
    """Document sharing between students"""
    PERMISSION_CHOICES = [
        ('VIEW', 'Lecture seule'),
        ('DOWNLOAD', 'Téléchargement'),
        ('COMMENT', 'Commentaire'),
    ]
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    shared_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents_shared')
    shared_with = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents_received')
    permission = models.CharField(max_length=10, choices=PERMISSION_CHOICES, default='VIEW')
    
    shared_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.document.title} partagé avec {self.shared_with.username}"
    
    @property
    def is_expired(self):
        if not self.expires_at:
            return False
        return self.expires_at < datetime.now()


class DocumentTemplate(models.Model):
    """Templates for common documents"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    document_type = models.CharField(max_length=20, choices=Document.DOCUMENT_TYPES)
    template_file = models.FileField(upload_to='templates/')
    
    # Required fields for this template
    required_fields = models.JSONField(default=list)
    optional_fields = models.JSONField(default=list)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class DocumentRequest(models.Model):
    """Requests for official documents"""
    REQUEST_TYPES = [
        ('ATTESTATION_SCOLARITE', 'Attestation de scolarité'),
        ('RELEVE_NOTES', 'Relevé de notes'),
        ('CERTIFICAT_SCOLARITE', 'Certificat de scolarité'),
        ('CONVENTION_STAGE', 'Convention de stage'),
        ('DUPLICATA_DIPLOME', 'Duplicata de diplôme'),
        ('OTHER', 'Autre'),
    ]
    
    STATUS_CHOICES = [
        ('SUBMITTED', 'Soumise'),
        ('PROCESSING', 'En cours'),
        ('READY', 'Prête'),
        ('DELIVERED', 'Livrée'),
        ('REJECTED', 'Rejetée'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    request_type = models.CharField(max_length=30, choices=REQUEST_TYPES)
    description = models.TextField()
    quantity = models.IntegerField(default=1)
    
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='SUBMITTED')
    urgency = models.BooleanField(default=False)
    
    # Dates
    requested_at = models.DateTimeField(auto_now_add=True)
    expected_delivery = models.DateField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    # Processing info
    processed_by = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    
    def __str__(self):
        return f"Demande {self.get_request_type_display()} - {self.student.username}"
    
    class Meta:
        ordering = ['-requested_at']


class DocumentReminder(models.Model):
    """Reminders for document expiry or renewals"""
    REMINDER_TYPES = [
        ('EXPIRY', 'Expiration'),
        ('RENEWAL', 'Renouvellement'),
        ('SUBMISSION', 'Soumission'),
        ('DEADLINE', 'Échéance'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, null=True, blank=True)
    document_request = models.ForeignKey(DocumentRequest, on_delete=models.CASCADE, null=True, blank=True)
    
    reminder_type = models.CharField(max_length=15, choices=REMINDER_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    remind_at = models.DateTimeField()
    
    is_sent = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Rappel: {self.title} pour {self.student.username}"
    
    class Meta:
        ordering = ['remind_at']


class DocumentComment(models.Model):
    """Comments on shared documents"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    
    # For replies
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Commentaire de {self.author.username} sur {self.document.title}"
    
    class Meta:
        ordering = ['created_at']


class DocumentVersion(models.Model):
    """Version control for documents"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField()
    file = models.FileField(upload_to='document_versions/%Y/%m/')
    upload_reason = models.CharField(max_length=200)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.document.title} v{self.version_number}"
    
    class Meta:
        unique_together = ('document', 'version_number')
        ordering = ['-version_number']
