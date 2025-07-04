from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard_stats'),
    path('stats/activities/', views.recent_activities, name='recent_activities'),
    path('stats/upcoming/', views.upcoming_items, name='upcoming_items'),
    path('notifications/', views.notifications, name='notifications'),
]
