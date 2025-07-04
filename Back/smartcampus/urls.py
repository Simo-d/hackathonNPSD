"""
URL configuration for smartcampus project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/schedules/', include('schedules.urls')),
    path('api/budget/', include('budget.urls')),
    path('api/transport/', include('transport.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/matching/', include('matching.urls')),
    path('api/collaboration/', include('collaboration.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
