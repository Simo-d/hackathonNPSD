from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum
from datetime import datetime, timedelta
from accounts.models import Student
from budget.models import Budget, Expense
from schedules.models import Course, Assignment
from matching.models import StudyGroup


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for the current user"""
    user = request.user
    
    # Budget stats
    current_month = datetime.now().replace(day=1).date()
    try:
        current_budget = Budget.objects.get(student=user, month=current_month)
        total_budget = float(current_budget.total_budget)
        total_expenses = float(current_budget.total_expenses)
        remaining_budget = total_budget - total_expenses
    except Budget.DoesNotExist:
        total_budget = 0
        total_expenses = 0
        remaining_budget = 0
    
    # Study groups stats
    active_groups = StudyGroup.objects.filter(
        members=user,
        status='ACTIVE'
    ).count()
    
    # Assignments stats
    pending_assignments = Assignment.objects.filter(
        course__students=user,
        due_date__gte=datetime.now().date(),
        is_completed=False
    ).count() if hasattr(Assignment, 'is_completed') else 0
    
    # Recent expenses (last 7 days)
    week_ago = datetime.now().date() - timedelta(days=7)
    recent_expenses = Expense.objects.filter(
        budget__student=user,
        date__gte=week_ago
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    return Response({
        'budget': {
            'total_budget': total_budget,
            'total_expenses': total_expenses,
            'remaining_budget': remaining_budget,
            'recent_expenses': float(recent_expenses)
        },
        'academic': {
            'active_study_groups': active_groups,
            'pending_assignments': pending_assignments,
            'enrolled_courses': user.courses.count() if hasattr(user, 'courses') else 0
        },
        'social': {
            'forum_posts': 0,  # À implémenter si nécessaire
            'events_attending': 0  # À implémenter si nécessaire
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activities(request):
    """Get recent activities for the user"""
    user = request.user
    limit = int(request.GET.get('limit', 5))
    
    activities = []
    
    # Recent expenses
    recent_expenses = Expense.objects.filter(
        budget__student=user
    ).order_by('-created_at')[:limit]
    
    for expense in recent_expenses:
        activities.append({
            'type': 'expense',
            'title': f'Dépense: {expense.description}',
            'description': f'{expense.amount}€ - {expense.category.name}',
            'date': expense.created_at.isoformat(),
            'icon': '💳'
        })
    
    # Recent study group activities
    recent_groups = StudyGroup.objects.filter(
        members=user
    ).order_by('-created_at')[:limit]
    
    for group in recent_groups:
        activities.append({
            'type': 'study_group',
            'title': f'Groupe d\'étude: {group.name}',
            'description': f'{group.course.name}',
            'date': group.created_at.isoformat(),
            'icon': '📚'
        })
    
    # Sort by date and limit
    activities.sort(key=lambda x: x['date'], reverse=True)
    
    return Response(activities[:limit])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_items(request):
    """Get upcoming items (assignments, exams, events)"""
    user = request.user
    limit = int(request.GET.get('limit', 4))
    
    upcoming = []
    
    # Upcoming assignments
    try:
        upcoming_assignments = Assignment.objects.filter(
            course__students=user,
            due_date__gte=datetime.now().date()
        ).order_by('due_date')[:limit]
        
        for assignment in upcoming_assignments:
            upcoming.append({
                'type': 'assignment',
                'title': assignment.title,
                'description': f'Cours: {assignment.course.name}',
                'date': assignment.due_date.isoformat(),
                'priority': 'high' if assignment.due_date <= datetime.now().date() + timedelta(days=2) else 'medium',
                'icon': '📝'
            })
    except:
        pass  # Table Assignment might not exist yet
    
    # Mock upcoming events for now
    upcoming.extend([
        {
            'type': 'event',
            'title': 'Réunion groupe d\'étude',
            'description': 'Mathématiques - Salle 101',
            'date': (datetime.now() + timedelta(days=1)).isoformat(),
            'priority': 'medium',
            'icon': '👥'
        },
        {
            'type': 'reminder',
            'title': 'Rappel budget',
            'description': 'Mettre à jour vos dépenses',
            'date': (datetime.now() + timedelta(days=3)).isoformat(),
            'priority': 'low',
            'icon': '⏰'
        }
    ])
    
    # Sort by date and limit
    upcoming.sort(key=lambda x: x['date'])
    
    return Response(upcoming[:limit])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    """Get user notifications"""
    user = request.user
    
    notifications = [
        {
            'id': 1,
            'type': 'info',
            'title': 'Bienvenue sur SmartCampus!',
            'message': 'Complétez votre profil pour une meilleure expérience',
            'is_read': False,
            'created_at': datetime.now().isoformat()
        }
    ]
    
    # Check budget alerts
    try:
        current_month = datetime.now().replace(day=1).date()
        current_budget = Budget.objects.get(student=user, month=current_month)
        if current_budget.remaining_budget < 0:
            notifications.append({
                'id': 2,
                'type': 'warning',
                'title': 'Budget dépassé',
                'message': f'Vous avez dépassé votre budget de {abs(current_budget.remaining_budget)}€',
                'is_read': False,
                'created_at': datetime.now().isoformat()
            })
    except Budget.DoesNotExist:
        notifications.append({
            'id': 3,
            'type': 'info',
            'title': 'Configurez votre budget',
            'message': 'Créez votre premier budget mensuel',
            'is_read': False,
            'created_at': datetime.now().isoformat()
        })
    
    return Response(notifications)
