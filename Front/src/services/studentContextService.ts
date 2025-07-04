import { apiRequest, API_ENDPOINTS } from './api';
import { StudentContext } from './openRouterService';

export class StudentContextService {
  static async getStudentContext(user: any): Promise<StudentContext> {
    try {
      // Données de base de l'utilisateur
      const context: StudentContext = {
        name: `${user.first_name} ${user.last_name}`,
        level: user.level,
        filiere: user.filiere,
        enrollmentYear: user.profile?.enrollment_year || 2024,
        expectedGraduation: user.profile?.expected_graduation || 2027,
      };

      // Charger les données en parallèle
      const [schedule, budget, studyGroups, assignments] = await Promise.allSettled([
        this.getScheduleData(),
        this.getBudgetData(),
        this.getStudyGroupsData(),
        this.getAssignmentsData()
      ]);

      // Ajouter les données réussies au contexte
      if (schedule.status === 'fulfilled') {
        context.schedule = schedule.value;
      }

      if (budget.status === 'fulfilled') {
        context.budget = budget.value;
      }

      if (studyGroups.status === 'fulfilled') {
        context.studyGroups = studyGroups.value;
      }

      if (assignments.status === 'fulfilled') {
        context.assignments = assignments.value;
      }

      return context;
    } catch (error) {
      console.error('Erreur lors du chargement du contexte étudiant:', error);
      // Retourner un contexte minimal en cas d'erreur
      return {
        name: `${user.first_name} ${user.last_name}`,
        level: user.level,
        filiere: user.filiere,
        enrollmentYear: user.profile?.enrollment_year || 2024,
        expectedGraduation: user.profile?.expected_graduation || 2027,
      };
    }
  }

  private static async getScheduleData() {
    try {
      const data = await apiRequest(API_ENDPOINTS.SCHEDULES);
      return data.results?.map((item: any) => ({
        day: item.day_of_week,
        subject: item.course?.name || 'Cours',
        time: `${item.start_time} - ${item.end_time}`,
        room: item.room
      })) || [];
    } catch (error) {
      console.log('Emploi du temps non disponible');
      return [];
    }
  }

  private static async getBudgetData() {
    try {
      const data = await apiRequest('/budget/current-budget/');
      return {
        total: data.total_budget || 0,
        spent: data.total_expenses || 0,
        remaining: data.remaining_budget || 0
      };
    } catch (error) {
      console.log('Budget non disponible');
      return null;
    }
  }

  private static async getStudyGroupsData() {
    try {
      const data = await apiRequest(API_ENDPOINTS.STUDY_GROUPS);
      return data.results?.map((group: any) => ({
        name: group.name,
        subject: group.course?.name || 'Matière',
        members: group.members?.length || 0
      })) || [];
    } catch (error) {
      console.log('Groupes d\'étude non disponibles');
      return [];
    }
  }

  private static async getAssignmentsData() {
    try {
      const data = await apiRequest(API_ENDPOINTS.ASSIGNMENTS);
      return data.results?.map((assignment: any) => ({
        title: assignment.title,
        dueDate: new Date(assignment.due_date).toLocaleDateString('fr-FR'),
        priority: assignment.priority || 'medium',
        course: assignment.course?.name || 'Cours'
      })) || [];
    } catch (error) {
      console.log('Devoirs non disponibles');
      return [];
    }
  }
}
