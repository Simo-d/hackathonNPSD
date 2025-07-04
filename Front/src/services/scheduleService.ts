import { apiRequest, API_ENDPOINTS } from './api';
import type { 
  Schedule, 
  Course, 
  Assignment, 
  Exam 
} from '../types';

export interface ScheduleRequest {
  course: string;
  day_of_week: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  start_time: string;
  end_time: string;
  room: string;
  type: 'COURSE' | 'TD' | 'TP' | 'EXAM';
}

export interface AssignmentRequest {
  title: string;
  description: string;
  course: string;
  due_date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimated_hours: number;
}

export interface ExamRequest {
  title: string;
  course: string;
  exam_date: string;
  duration: string;
  room: string;
  type: 'MIDTERM' | 'FINAL' | 'QUIZ' | 'PRACTICAL';
  instructions?: string;
}

export class ScheduleService {
  // Get all schedules for current user
  static async getSchedules(): Promise<Schedule[]> {
    return await apiRequest(API_ENDPOINTS.SCHEDULES);
  }

  // Get courses
  static async getCourses(): Promise<Course[]> {
    return await apiRequest(API_ENDPOINTS.COURSES);
  }

  // Create new schedule entry
  static async createSchedule(scheduleData: ScheduleRequest): Promise<Schedule> {
    return await apiRequest(API_ENDPOINTS.SCHEDULES, {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  // Update schedule
  static async updateSchedule(id: string, scheduleData: Partial<ScheduleRequest>): Promise<Schedule> {
    return await apiRequest(`${API_ENDPOINTS.SCHEDULES}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(scheduleData),
    });
  }

  // Delete schedule
  static async deleteSchedule(id: string): Promise<void> {
    await apiRequest(`${API_ENDPOINTS.SCHEDULES}${id}/`, {
      method: 'DELETE',
    });
  }

  // Get assignments
  static async getAssignments(): Promise<Assignment[]> {
    return await apiRequest(API_ENDPOINTS.ASSIGNMENTS);
  }

  // Create assignment
  static async createAssignment(assignmentData: AssignmentRequest): Promise<Assignment> {
    return await apiRequest(API_ENDPOINTS.ASSIGNMENTS, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  // Update assignment status
  static async updateAssignment(id: string, data: Partial<AssignmentRequest & { status: string }>): Promise<Assignment> {
    return await apiRequest(`${API_ENDPOINTS.ASSIGNMENTS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Mark assignment as completed
  static async completeAssignment(id: string): Promise<Assignment> {
    return await apiRequest(`${API_ENDPOINTS.ASSIGNMENTS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'COMPLETED', completed_at: new Date().toISOString() }),
    });
  }

  // Get exams
  static async getExams(): Promise<Exam[]> {
    return await apiRequest(API_ENDPOINTS.EXAMS);
  }

  // Create exam
  static async createExam(examData: ExamRequest): Promise<Exam> {
    return await apiRequest(API_ENDPOINTS.EXAMS, {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  }

  // Get reminders
  static async getReminders() {
    return await apiRequest(API_ENDPOINTS.REMINDERS);
  }

  // Create reminder
  static async createReminder(reminderData: {
    title: string;
    message: string;
    reminder_type: string;
    remind_at: string;
    assignment?: string;
    exam?: string;
  }) {
    return await apiRequest(API_ENDPOINTS.REMINDERS, {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  }
}
