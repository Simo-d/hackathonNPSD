import { apiRequest, API_ENDPOINTS } from './api';
import type { StudyGroup } from '../types';

export interface StudyGroupRequest {
  name: string;
  description: string;
  course: string; // Course ID
  max_members: number;
  study_type: 'EXAM_PREP' | 'HOMEWORK' | 'PROJECT' | 'GENERAL';
  meeting_frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  preferred_time: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'FLEXIBLE';
}

export interface MatchingRequestData {
  course: string; // Course ID
  preferred_group_size: number;
  study_type: 'EXAM_PREP' | 'HOMEWORK' | 'PROJECT' | 'GENERAL';
  availability: Record<string, string[]>; // day -> time slots
  preferences: Record<string, any>;
}

export interface CompatibilityRequest {
  student1_id: string;
  student2_id: string;
  course_id: string;
}

export class MatchingService {
  // Get study groups
  static async getStudyGroups(filters?: {
    course?: string;
    study_type?: string;
    available_only?: boolean;
  }): Promise<StudyGroup[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.course) queryParams.append('course', filters.course);
    if (filters?.study_type) queryParams.append('study_type', filters.study_type);
    if (filters?.available_only) queryParams.append('available_only', 'true');
    
    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.STUDY_GROUPS}?${queryParams.toString()}`
      : API_ENDPOINTS.STUDY_GROUPS;
    
    return await apiRequest(endpoint);
  }

  // Get recommended study groups (AI-powered)
  static async getRecommendedGroups(course_id?: string): Promise<StudyGroup[]> {
    const queryParams = course_id ? `?course=${course_id}` : '';
    return await apiRequest(`${API_ENDPOINTS.STUDY_GROUPS}recommended/${queryParams}`);
  }

  // Create study group
  static async createStudyGroup(groupData: StudyGroupRequest): Promise<StudyGroup> {
    return await apiRequest(API_ENDPOINTS.STUDY_GROUPS, {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  // Update study group
  static async updateStudyGroup(id: string, groupData: Partial<StudyGroupRequest>): Promise<StudyGroup> {
    return await apiRequest(`${API_ENDPOINTS.STUDY_GROUPS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(groupData),
    });
  }

  // Delete study group
  static async deleteStudyGroup(id: string): Promise<void> {
    await apiRequest(`${API_ENDPOINTS.STUDY_GROUPS}${id}/`, {
      method: 'DELETE',
    });
  }

  // Join study group
  static async joinStudyGroup(id: string): Promise<StudyGroup> {
    return await apiRequest(`${API_ENDPOINTS.STUDY_GROUPS}${id}/join/`, {
      method: 'POST',
    });
  }

  // Leave study group
  static async leaveStudyGroup(id: string): Promise<StudyGroup> {
    return await apiRequest(`${API_ENDPOINTS.STUDY_GROUPS}${id}/leave/`, {
      method: 'POST',
    });
  }

  // Get my study groups
  static async getMyStudyGroups(): Promise<StudyGroup[]> {
    return await apiRequest(`${API_ENDPOINTS.STUDY_GROUPS}my-groups/`);
  }

  // Get study groups I'm a member of
  static async getJoinedStudyGroups(): Promise<StudyGroup[]> {
    return await apiRequest(`${API_ENDPOINTS.STUDY_GROUPS}joined/`);
  }

  // Create matching request
  static async createMatchingRequest(requestData: MatchingRequestData) {
    return await apiRequest(API_ENDPOINTS.MATCHING_REQUESTS, {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Get my matching requests
  static async getMyMatchingRequests() {
    return await apiRequest(API_ENDPOINTS.MATCHING_REQUESTS);
  }

  // Cancel matching request
  static async cancelMatchingRequest(id: string) {
    return await apiRequest(`${API_ENDPOINTS.MATCHING_REQUESTS}${id}/`, {
      method: 'DELETE',
    });
  }

  // Find matches using AI
  static async findMatches(requestData: {
    course_id: string;
    preferences?: Record<string, any>;
    group_size?: number;
  }) {
    return await apiRequest(API_ENDPOINTS.FIND_MATCHES, {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Get compatibility score between students
  static async getCompatibilityScore(student1_id: string, student2_id: string, course_id: string) {
    return await apiRequest(`${API_ENDPOINTS.COMPATIBILITY_SCORES}?student1=${student1_id}&student2=${student2_id}&course=${course_id}`);
  }

  // Calculate compatibility
  static async calculateCompatibility(compatibilityData: CompatibilityRequest) {
    return await apiRequest(`${API_ENDPOINTS.COMPATIBILITY_SCORES}calculate/`, {
      method: 'POST',
      body: JSON.stringify(compatibilityData),
    });
  }

  // Get group statistics
  static async getGroupStatistics() {
    return await apiRequest(`${API_ENDPOINTS.STUDY_GROUPS}statistics/`);
  }

  // Get matching analytics
  static async getMatchingAnalytics() {
    return await apiRequest(`${API_ENDPOINTS.MATCHING_REQUESTS}analytics/`);
  }

  // Update student preferences for matching
  static async updateMatchingPreferences(preferences: {
    study_preferences: Record<string, any>;
    availability: Record<string, string[]>;
    interests: string[];
  }) {
    return await apiRequest(`${API_ENDPOINTS.PROFILE}matching-preferences/`, {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  // Get optimal group formation suggestions
  static async getOptimalGroupFormation(course_id: string, student_ids: string[]) {
    return await apiRequest(`${API_ENDPOINTS.FIND_MATCHES}optimal/`, {
      method: 'POST',
      body: JSON.stringify({
        course_id,
        student_ids,
      }),
    });
  }
}
