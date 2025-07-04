from django.db import models
from django.conf import settings


class TransportProvider(models.Model):
    """Transport service providers (taxis, buses, etc.)"""
    PROVIDER_TYPES = [
        ('BUS', 'Bus'),
        ('TAXI', 'Taxi'),
        ('SHARED_TAXI', 'Taxi partagé'),
        ('PRIVATE', 'Transport privé'),
    ]
    
    name = models.CharField(max_length=100)
    provider_type = models.CharField(max_length=15, choices=PROVIDER_TYPES)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0)
    
    def __str__(self):
        return f"{self.name} ({self.get_provider_type_display()})"


class Route(models.Model):
    """Transport routes"""
    name = models.CharField(max_length=100)
    start_location = models.CharField(max_length=100)
    end_location = models.CharField(max_length=100)
    distance_km = models.FloatField()
    estimated_duration = models.DurationField()
    waypoints = models.JSONField(default=list, blank=True)  # Intermediate stops
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name}: {self.start_location} → {self.end_location}"


class TransportSchedule(models.Model):
    """Transport schedules and availability"""
    DAYS_OF_WEEK = [
        ('MON', 'Lundi'),
        ('TUE', 'Mardi'),
        ('WED', 'Mercredi'),
        ('THU', 'Jeudi'),
        ('FRI', 'Vendredi'),
        ('SAT', 'Samedi'),
        ('SUN', 'Dimanche'),
    ]
    
    provider = models.ForeignKey(TransportProvider, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    days_of_week = models.JSONField(default=list)  # List of active days
    price = models.DecimalField(max_digits=8, decimal_places=2)
    capacity = models.IntegerField()
    is_recurring = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.provider.name} - {self.route.name} at {self.departure_time}"


class TransportRequest(models.Model):
    """Student transport requests"""
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('CONFIRMED', 'Confirmé'),
        ('IN_PROGRESS', 'En cours'),
        ('COMPLETED', 'Terminé'),
        ('CANCELLED', 'Annulé'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_location = models.CharField(max_length=100)
    end_location = models.CharField(max_length=100)
    preferred_departure_time = models.DateTimeField()
    flexible_time = models.BooleanField(default=True)
    max_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    passenger_count = models.IntegerField(default=1)
    special_requirements = models.TextField(blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    
    # Matching results
    matched_schedules = models.ManyToManyField(TransportSchedule, blank=True)
    selected_schedule = models.ForeignKey(TransportSchedule, on_delete=models.SET_NULL, null=True, blank=True, related_name='selected_requests')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Demande de {self.student.username}: {self.start_location} → {self.end_location}"


class TransportBooking(models.Model):
    """Confirmed transport bookings"""
    STATUS_CHOICES = [
        ('BOOKED', 'Réservé'),
        ('CONFIRMED', 'Confirmé'),
        ('IN_PROGRESS', 'En cours'),
        ('COMPLETED', 'Terminé'),
        ('CANCELLED', 'Annulé'),
        ('NO_SHOW', 'Absent'),
    ]
    
    request = models.OneToOneField(TransportRequest, on_delete=models.CASCADE)
    schedule = models.ForeignKey(TransportSchedule, on_delete=models.CASCADE)
    booking_reference = models.CharField(max_length=20, unique=True)
    passenger_count = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='BOOKED')
    
    # Additional info
    pickup_location = models.CharField(max_length=200, blank=True)
    dropoff_location = models.CharField(max_length=200, blank=True)
    driver_contact = models.CharField(max_length=15, blank=True)
    vehicle_info = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Réservation {self.booking_reference} - {self.request.student.username}"


class SharedRide(models.Model):
    """Shared rides between students"""
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_rides')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, through='RideParticipation', related_name='shared_rides')
    
    start_location = models.CharField(max_length=100)
    end_location = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    available_seats = models.IntegerField()
    price_per_person = models.DecimalField(max_digits=8, decimal_places=2)
    
    description = models.TextField(blank=True)
    vehicle_info = models.CharField(max_length=100, blank=True)
    contact_info = models.CharField(max_length=100)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Trajet partagé: {self.start_location} → {self.end_location}"
    
    @property
    def available_spots(self):
        return max(0, self.available_seats - self.participants.count())


class RideParticipation(models.Model):
    """Participation in shared rides"""
    STATUS_CHOICES = [
        ('REQUESTED', 'Demandé'),
        ('CONFIRMED', 'Confirmé'),
        ('CANCELLED', 'Annulé'),
    ]
    
    ride = models.ForeignKey(SharedRide, on_delete=models.CASCADE)
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='REQUESTED')
    requested_seats = models.IntegerField(default=1)
    pickup_point = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.participant.username} in {self.ride}"


class TransportNotification(models.Model):
    """Transport-related notifications"""
    NOTIFICATION_TYPES = [
        ('SCHEDULE_UPDATE', 'Mise à jour horaire'),
        ('BOOKING_CONFIRMED', 'Réservation confirmée'),
        ('RIDE_CANCELLED', 'Trajet annulé'),
        ('NEW_SHARED_RIDE', 'Nouveau trajet partagé'),
        ('DEPARTURE_REMINDER', 'Rappel de départ'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    
    # Optional references
    booking = models.ForeignKey(TransportBooking, on_delete=models.CASCADE, null=True, blank=True)
    shared_ride = models.ForeignKey(SharedRide, on_delete=models.CASCADE, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Notification: {self.title} pour {self.student.username}"
