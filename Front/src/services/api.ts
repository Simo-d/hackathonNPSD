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
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  REFRESH: '/auth/refresh/',
  
  // Events
  EVENTS: '/events/',
  MY_EVENTS: '/events/my-events/',
  JOIN_EVENT: (id: string) => `/events/${id}/join/`,
  LEAVE_EVENT: (id: string) => `/events/${id}/leave/`,
  LIKE_EVENT: (id: string) => `/events/${id}/like/`,
  
  // Student profile
  PROFILE: '/students/profile/',
  
  // Other endpoints can be added here
};
