import { apiRequest, API_ENDPOINTS } from './api';

export interface DashboardStats {
  total_courses: number;
  pending_assignments: number;
  upcoming_exams: number;
  budget_remaining: number;
  study_groups: number;
  upcoming_events: number;
  monthly_expenses: number;
  grade_average: number;
  this_week_courses: number;
  current_gpa: number;
  attendance_rate: number;
}

export interface DashboardActivity {
  id: string;
  type: 'assignment' | 'exam' | 'budget' | 'group' | 'event' | 'grade';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
  link?: string;
}

export interface UpcomingItem {
  id: string;
  title: string;
  type: 'course' | 'exam' | 'assignment' | 'event';
  date: string;
  time?: string;
  location?: string;
  priority: 'high' | 'medium' | 'low';
  course?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  count?: number;
}

export class DashboardService {
  // Get dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      return await apiRequest(API_ENDPOINTS.DASHBOARD_STATS);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Return mock data as fallback
      return {
        total_courses: 7,
        pending_assignments: 5,
        upcoming_exams: 2,
        budget_remaining: 2450,
        study_groups: 3,
        upcoming_events: 8,
        monthly_expenses: 1550,
        grade_average: 85.5,
        this_week_courses: 12,
        current_gpa: 3.2,
        attendance_rate: 92.5,
      };
    }
  }

  // Get recent activities
  static async getRecentActivities(limit: number = 10): Promise<DashboardActivity[]> {
    try {
      return await apiRequest(`${API_ENDPOINTS.DASHBOARD_STATS}activities/?limit=${limit}`);
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      // Return mock data as fallback
      return [
        {
          id: '1',
          type: 'assignment',
          title: 'Devoir de Programmation soumis',
          description: 'Votre devoir de programmation Python a été soumis avec succès',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          link: '/assignments'
        },
        {
          id: '2',
          type: 'group',
          title: 'Nouveau groupe d\'étude rejoint',
          description: 'Vous avez rejoint le groupe "Intelligence Artificielle Avancée"',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'info',
          link: '/study-groups'
        },
        {
          id: '3',
          type: 'budget',
          title: 'Profil étudiant mis à jour',
          description: 'Vos préférences d\'étude ont été mises à jour',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'info',
          link: '/profile'
        }
      ];
    }
  }

  // Get upcoming items
  static async getUpcomingItems(limit: number = 10): Promise<UpcomingItem[]> {
    try {
      return await apiRequest(`${API_ENDPOINTS.DASHBOARD_STATS}upcoming/?limit=${limit}`);
    } catch (error) {
      console.error('Failed to fetch upcoming items:', error);
      // Return mock data as fallback
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const friday = new Date(today);
      friday.setDate(today.getDate() + (5 - today.getDay()));
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + (6 - today.getDay()));

      return [
        {
          id: '1',
          title: 'Cours de Mathématiques',
          type: 'course',
          date: today.toISOString(),
          time: '14:00',
          location: 'Amphi A',
          priority: 'medium',
          course: 'MATH701'
        },
        {
          id: '2',
          title: 'Devoir Algorithmique',
          type: 'assignment',
          date: tomorrow.toISOString(),
          time: '23:59',
          priority: 'high',
          course: 'ALG201'
        },
        {
          id: '3',
          title: 'Examen Physique',
          type: 'exam',
          date: friday.toISOString(),
          time: '08:00',
          location: 'Salle 203',
          priority: 'high',
          course: 'PHYS'
        },
        {
          id: '4',
          title: 'Session étude IA',
          type: 'event',
          date: saturday.toISOString(),
          time: '15:00',
          location: 'Lab Info 1',
          priority: 'medium'
        }
      ];
    }
  }

  // Get quick actions with dynamic counts
  static async getQuickActions(): Promise<QuickAction[]> {
    try {
      return await apiRequest(`${API_ENDPOINTS.DASHBOARD_STATS}quick-actions/`);
    } catch (error) {
      console.error('Failed to fetch quick actions:', error);
      // Return mock data as fallback
      return [
        {
          id: '1',
          title: 'Nouveau groupe d\'étude',
          description: 'Utilisez l\'IA pour trouver des partenaires',
          icon: 'Brain',
          href: '/ai-matching',
          color: 'from-pink-500 to-purple-600'
        },
        {
          id: '2',
          title: 'Ajouter une dépense',
          description: 'Suivez votre budget étudiant',
          icon: 'Wallet',
          href: '/budget',
          color: 'from-green-500 to-teal-600'
        },
        {
          id: '3',
          title: 'Chercher un transport',
          description: 'Trouvez des options de trajet',
          icon: 'MapPin',
          href: '/transport',
          color: 'from-red-500 to-orange-600'
        },
        {
          id: '4',
          title: 'Poster sur le forum',
          description: 'Posez vos questions à la communauté',
          icon: 'Users',
          href: '/forum',
          color: 'from-blue-500 to-indigo-600'
        }
      ];
    }
  }

  // Get notifications
  static async getNotifications(filters?: {
    unread_only?: boolean;
    limit?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.unread_only) queryParams.append('unread_only', 'true');
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      
      const endpoint = queryParams.toString() 
        ? `${API_ENDPOINTS.NOTIFICATIONS}?${queryParams.toString()}`
        : API_ENDPOINTS.NOTIFICATIONS;
      
      return await apiRequest(endpoint);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  static async markNotificationAsRead(id: string) {
    try {
      return await apiRequest(`${API_ENDPOINTS.NOTIFICATIONS}${id}/read/`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllNotificationsAsRead() {
    try {
      return await apiRequest(`${API_ENDPOINTS.NOTIFICATIONS}mark-all-read/`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  // Get semester progress
  static async getSemesterProgress() {
    try {
      return await apiRequest(`${API_ENDPOINTS.DASHBOARD_STATS}semester-progress/`);
    } catch (error) {
      console.error('Failed to fetch semester progress:', error);
      return {
        current_week: 12,
        total_weeks: 16,
        completed_assignments: 8,
        total_assignments: 12,
        attendance_rate: 92.5,
        gpa: 3.2
      };
    }
  }

  // Get academic calendar events
  static async getAcademicCalendar() {
    try {
      return await apiRequest(`${API_ENDPOINTS.DASHBOARD_STATS}academic-calendar/`);
    } catch (error) {
      console.error('Failed to fetch academic calendar:', error);
      return [];
    }
  }

  // Get performance analytics
  static async getPerformanceAnalytics(period: 'week' | 'month' | 'semester' = 'month') {
    try {
      return await apiRequest(`${API_ENDPOINTS.DASHBOARD_STATS}performance/?period=${period}`);
    } catch (error) {
      console.error('Failed to fetch performance analytics:', error);
      return {
        grade_trend: [],
        assignment_completion_rate: 85,
        study_hours: 24,
        group_participation: 78
      };
    }
  }
}
