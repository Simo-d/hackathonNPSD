import { User, Project, Task, Client, Invoice, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@company.com',
    role: 'admin',
    department: 'Direction',
    joinDate: '2020-01-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@company.com',
    role: 'manager',
    department: 'Développement',
    joinDate: '2021-03-10',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'pierre.durand@company.com',
    role: 'employee',
    department: 'Développement',
    joinDate: '2022-06-01',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@company.com',
    role: 'employee',
    department: 'Design',
    joinDate: '2021-09-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Plateforme E-commerce',
    description: 'Développement d\'une plateforme e-commerce moderne avec React et Node.js',
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 65,
    budget: 150000,
    spent: 97500,
    teamMembers: ['2', '3', '4'],
    manager: '2'
  },
  {
    id: '2',
    name: 'Application Mobile',
    description: 'Application mobile native pour iOS et Android',
    status: 'planning',
    priority: 'medium',
    startDate: '2024-03-01',
    endDate: '2024-09-15',
    progress: 15,
    budget: 120000,
    spent: 18000,
    teamMembers: ['3', '4'],
    manager: '2'
  },
  {
    id: '3',
    name: 'Système CRM',
    description: 'Système de gestion de la relation client personnalisé',
    status: 'completed',
    priority: 'high',
    startDate: '2023-08-01',
    endDate: '2024-01-31',
    progress: 100,
    budget: 200000,
    spent: 195000,
    teamMembers: ['2', '3'],
    manager: '2'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Conception de l\'interface utilisateur',
    description: 'Créer les maquettes et prototypes pour l\'interface principale',
    status: 'completed',
    priority: 'high',
    assignee: '4',
    projectId: '1',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15',
    estimatedHours: 40,
    actualHours: 38
  },
  {
    id: '2',
    title: 'Développement API REST',
    description: 'Implémentation des endpoints pour la gestion des produits',
    status: 'in-progress',
    priority: 'high',
    assignee: '3',
    projectId: '1',
    dueDate: '2024-03-01',
    createdAt: '2024-02-01',
    estimatedHours: 60,
    actualHours: 45
  },
  {
    id: '3',
    title: 'Tests unitaires',
    description: 'Écriture des tests unitaires pour les composants React',
    status: 'todo',
    priority: 'medium',
    assignee: '3',
    projectId: '1',
    dueDate: '2024-03-15',
    createdAt: '2024-02-10',
    estimatedHours: 30
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+33 1 23 45 67 89',
    company: 'TechCorp Solutions',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    status: 'active',
    totalValue: 350000,
    projectsCount: 3,
    lastContact: '2024-02-20'
  },
  {
    id: '2',
    name: 'InnovateLab',
    email: 'hello@innovatelab.fr',
    phone: '+33 1 98 76 54 32',
    company: 'InnovateLab',
    address: '456 Rue de Rivoli, 75001 Paris',
    status: 'active',
    totalValue: 120000,
    projectsCount: 1,
    lastContact: '2024-02-18'
  },
  {
    id: '3',
    name: 'StartupXYZ',
    email: 'team@startupxyz.com',
    phone: '+33 1 11 22 33 44',
    company: 'StartupXYZ',
    address: '789 Boulevard Saint-Germain, 75007 Paris',
    status: 'prospect',
    totalValue: 0,
    projectsCount: 0,
    lastContact: '2024-02-15'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    clientId: '1',
    projectId: '1',
    amount: 25000,
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    items: [
      {
        id: '1',
        description: 'Développement Frontend - Phase 1',
        quantity: 100,
        rate: 250,
        amount: 25000
      }
    ]
  },
  {
    id: '2',
    clientId: '1',
    projectId: '1',
    amount: 30000,
    status: 'sent',
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    items: [
      {
        id: '2',
        description: 'Développement Backend - Phase 1',
        quantity: 120,
        rate: 250,
        amount: 30000
      }
    ]
  }
];

export const mockDashboardStats: DashboardStats = {
  totalProjects: 12,
  activeProjects: 8,
  completedTasks: 156,
  totalRevenue: 850000,
  monthlyGrowth: 12.5,
  teamProductivity: 87
};