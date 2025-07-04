import { useState, useEffect, createContext, useContext } from 'react';
import { Student } from '../types';
import { AuthService, LoginCredentials, RegisterData } from '../services/authService';

// Simple notification function
const notify = {
  success: (message: string) => {
    console.log('✅ Success:', message);
  },
  error: (message: string) => {
    console.log('❌ Error:', message);
    alert(message);
  }
};

// Mock student data for testing (fallback)
const mockStudents: Record<string, Student> = {
  'demo_student': {
    id: '1',
    username: 'demo_student',
    email: 'demo@fp-ouarzazate.ma',
    first_name: 'Ahmed',
    last_name: 'Benali',
    student_id: 'FPO2024001',
    level: 'L3',
    filiere: 'INFO',
    phone_number: '+212 6 12 34 56 78',
    birth_date: '2000-05-15',
    address: 'Hay Al Wahda, Ouarzazate',
    study_preferences: {
      study_style: 'group',
      preferred_group_size: 4,
      preferred_study_time: 'evening'
    },
    interests: ['Algorithmique', 'Intelligence Artificielle', 'Développement Web'],
    availability: {
      monday: ['14:00-18:00'],
      tuesday: ['16:00-20:00'],
      wednesday: ['14:00-18:00'],
      thursday: ['16:00-20:00'],
      friday: ['14:00-18:00']
    },
    profile: {
      gpa: 3.2,
      enrollment_year: 2022,
      expected_graduation: 2025,
      preferred_group_size: 4,
      communication_preference: 'whatsapp',
      emergency_contact_name: 'Fatima Benali',
      emergency_contact_phone: '+212 6 87 65 43 21'
    }
  }
};

// Mock credentials
const mockCredentials: Record<string, string> = {
  'demo_student': 'demo123',
  'student2': 'password123',
  'admin_user': 'admin123'
};

interface AuthContextType {
  user: Student | null;
  login: (username: string, password: string) => Promise<boolean>;
  directLogin: (username: string) => void;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (data: Partial<Student>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if we have tokens
      const tokens = AuthService.getTokens();
      if (!tokens) {
        setIsLoading(false);
        return;
      }

      // Try to get current user from API
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to get current user:', error);
        // If API fails, try to get user from localStorage (fallback)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (parseError) {
            console.error('Error parsing saved user:', parseError);
            AuthService.logout();
          }
        } else {
          AuthService.logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      AuthService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Direct login function for testing
  const directLogin = (username: string) => {
    const student = mockStudents[username];
    if (student) {
      const mockToken = `mock_token_${username}_${Date.now()}`;
      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('refresh_token', mockToken);
      localStorage.setItem('user', JSON.stringify(student));
      setUser(student);
      notify.success(`Connexion directe réussie pour ${student.first_name} ${student.last_name}`);
    } else {
      notify.error('Utilisateur de test non trouvé');
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // First try real API authentication
      try {
        const { user: apiUser, tokens } = await AuthService.login({ username, password });
        
        setUser(apiUser);
        // Store user data for offline access
        localStorage.setItem('user', JSON.stringify(apiUser));
        
        notify.success('Connexion réussie !');
        return true;
      } catch (apiError) {
        console.log('API login failed, trying mock authentication:', apiError);
        
        // Fallback to mock authentication for testing
        if (mockCredentials[username] === password) {
          const student = mockStudents[username];
          if (student) {
            const mockToken = `mock_token_${username}_${Date.now()}`;
            
            localStorage.setItem('access_token', mockToken);
            localStorage.setItem('refresh_token', mockToken);
            localStorage.setItem('user', JSON.stringify(student));
            setUser(student);
            
            notify.success('Connexion réussie (mode test) !');
            return true;
          }
        }
        
        // If both API and mock fail
        notify.error(`Connexion échouée. Comptes de test disponibles: ${Object.keys(mockCredentials).join(', ')}`);
        return false;
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      notify.error(error.message || 'Erreur de connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { user: apiUser, tokens } = await AuthService.register(data);
      
      setUser(apiUser);
      // Store user data for offline access
      localStorage.setItem('user', JSON.stringify(apiUser));
      
      notify.success('Inscription réussie !');
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      notify.error(error.message || 'Erreur lors de l\'inscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      AuthService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      notify.success('Déconnexion réussie');
    }
  };

  const updateProfile = async (data: Partial<Student>): Promise<boolean> => {
    try {
      // If using mock token, just update locally
      const tokens = AuthService.getTokens();
      if (tokens?.access.startsWith('mock_token_')) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser as Student);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        notify.success('Profil mis à jour (mode test)');
        return true;
      }

      // Otherwise try real API (would need updateProfile endpoint)
      try {
        // const updatedUser = await AuthService.updateProfile(data);
        // setUser(updatedUser);
        // localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // For now, just update locally
        const updatedUser = { ...user, ...data };
        setUser(updatedUser as Student);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        notify.success('Profil mis à jour');
        return true;
      } catch (error: any) {
        console.error('Profile update failed:', error);
        notify.error(error.message || 'Erreur lors de la mise à jour');
        return false;
      }
    } catch (error: any) {
      console.error('Profile update failed:', error);
      notify.error(error.message || 'Erreur lors de la mise à jour');
      return false;
    }
  };

  return {
    user,
    login,
    directLogin,
    register,
    logout,
    isLoading,
    updateProfile,
  };
};

export { AuthContext };
export { mockStudents, mockCredentials };
