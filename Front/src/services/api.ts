// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage or context
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Base fetch wrapper with auth
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Token ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // If we can't parse the error, use the default message
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// API endpoints based on Django backend structure
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  REFRESH: '/auth/refresh/',
  LOGOUT: '/auth/logout/',
  
  // Student Profile
  PROFILE: '/auth/profile/',
  UPDATE_PROFILE: '/auth/profile/',
  
  // Schedules
  SCHEDULES: '/schedules/',
  COURSES: '/schedules/courses/',
  ASSIGNMENTS: '/schedules/assignments/',
  EXAMS: '/schedules/exams/',
  REMINDERS: '/schedules/reminders/',
  
  // Budget
  BUDGETS: '/budget/budgets/',
  EXPENSES: '/budget/expenses/',
  EXPENSE_CATEGORIES: '/budget/categories/',
  SAVINGS_GOALS: '/budget/savings-goals/',
  RECURRING_EXPENSES: '/budget/recurring-expenses/',
  BUDGET_ALERTS: '/budget/alerts/',
  
  // Transport
  TRANSPORT_SCHEDULES: '/transport/schedules/',
  SHARED_RIDES: '/transport/shared-rides/',
  TRANSPORT_PROVIDERS: '/transport/providers/',
  ROUTES: '/transport/routes/',
  
  // Documents
  DOCUMENTS: '/documents/',
  DOCUMENT_CATEGORIES: '/documents/categories/',
  DOCUMENT_REQUESTS: '/documents/requests/',
  
  // Matching (AI)
  STUDY_GROUPS: '/matching/study-groups/',
  MATCHING_REQUESTS: '/matching/requests/',
  COMPATIBILITY_SCORES: '/matching/compatibility/',
  FIND_MATCHES: '/matching/find-matches/',
  
  // Collaboration
  FORUM_TOPICS: '/collaboration/forum/topics/',
  FORUM_CATEGORIES: '/collaboration/forum/categories/',
  EVENTS: '/collaboration/events/',
  MY_EVENTS: '/collaboration/events/my-events/',
  ATTENDING_EVENTS: '/collaboration/events/attending/',
  JOIN_EVENT: (id: string) => `/collaboration/events/${id}/join/`,
  LEAVE_EVENT: (id: string) => `/collaboration/events/${id}/leave/`,
  LIKE_EVENT: (id: string) => `/collaboration/events/${id}/like/`,
  TIP_SHARES: '/collaboration/tips/',
  POLLS: '/collaboration/polls/',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats/',
  NOTIFICATIONS: '/dashboard/notifications/',
};

// Helper function for file uploads
export const apiUpload = async (endpoint: string, formData: FormData) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {};
  
  if (token) {
    headers.Authorization = `Token ${token}`;
  }
  
  const config: RequestInit = {
    method: 'POST',
    headers,
    body: formData,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // If we can't parse the error, use the default message
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Upload failed:', error);
    throw error;
  }
};

export default { apiRequest, apiUpload, API_ENDPOINTS };
