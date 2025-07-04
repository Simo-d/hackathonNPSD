import { apiRequest, API_ENDPOINTS } from './api';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  student_id: string;
  level: string;
  filiere: string;
  phone_number?: string;
  enrollment_year: number;
  expected_graduation: number;
}

export interface BackendStudent {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  student_id: string;
  level: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  filiere: 'INFO' | 'MATH' | 'PHYS' | 'ECON' | 'GESTION' | 'DROIT';
  phone_number?: string;
  birth_date?: string;
  address?: string;
  profile_picture?: string;
  study_preferences: Record<string, any>;
  interests: string[];
  availability: Record<string, any>;
  profile?: {
    gpa?: number;
    enrollment_year: number;
    expected_graduation: number;
    preferred_group_size: number;
    communication_preference: 'whatsapp' | 'telegram' | 'discord' | 'email';
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
  };
}

// Transform backend student to frontend format
export const transformBackendStudent = (backendStudent: BackendStudent): import('../types').Student => {
  return {
    id: backendStudent.id,
    username: backendStudent.username,
    email: backendStudent.email,
    first_name: backendStudent.first_name,
    last_name: backendStudent.last_name,
    student_id: backendStudent.student_id,
    level: backendStudent.level,
    filiere: backendStudent.filiere,
    phone_number: backendStudent.phone_number,
    birth_date: backendStudent.birth_date,
    address: backendStudent.address,
    profile_picture: backendStudent.profile_picture,
    study_preferences: backendStudent.study_preferences,
    interests: backendStudent.interests,
    availability: backendStudent.availability,
    profile: backendStudent.profile
  };
};

export class AuthService {
  // Login
  static async login(credentials: LoginCredentials): Promise<{ user: any; tokens: AuthTokens }> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Store tokens
    if (data.access) {
      localStorage.setItem('access_token', data.access);
    }
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }

    return {
      user: data.user ? transformBackendStudent(data.user) : null,
      tokens: {
        access: data.access,
        refresh: data.refresh
      }
    };
  }

  // Register
  static async register(registerData: RegisterData): Promise<{ user: any; tokens: AuthTokens }> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}${API_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Store tokens
    if (data.access) {
      localStorage.setItem('access_token', data.access);
    }
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }

    return {
      user: data.user ? transformBackendStudent(data.user) : null,
      tokens: {
        access: data.access,
        refresh: data.refresh
      }
    };
  }

  // Get current user profile
  static async getCurrentUser() {
    const response = await apiRequest(API_ENDPOINTS.PROFILE);
    return transformBackendStudent(response);
  }

  // Refresh token
  static async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}${API_ENDPOINTS.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      // Refresh token is invalid, clear all tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Refresh token expired');
    }

    const data = await response.json();
    
    // Update stored tokens
    if (data.access) {
      localStorage.setItem('access_token', data.access);
    }
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }

    return {
      access: data.access,
      refresh: data.refresh || refreshToken
    };
  }

  // Logout
  static logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Get stored tokens
  static getTokens(): AuthTokens | null {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    
    if (!access || !refresh) {
      return null;
    }
    
    return { access, refresh };
  }
}
