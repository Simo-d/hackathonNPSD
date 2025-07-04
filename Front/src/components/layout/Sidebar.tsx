import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap,
  Home,
  Calendar,
  Users,
  Bot,
  Wallet,
  MapPin,
  FileText,
  MessageSquare,
  Calendar as CalendarIcon,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: Home, color: 'text-blue-600' },
  
  // Academic Section
  { 
    name: 'Emploi du temps', 
    href: '/schedule', 
    icon: Calendar, 
    color: 'text-green-600',
    section: 'Académique'
  },
  { 
    name: 'Groupes d\'étude', 
    href: '/study-groups', 
    icon: Users, 
    color: 'text-purple-600' 
  },
  { 
    name: 'Matching IA', 
    href: '/ai-matching', 
    icon: Bot, 
    color: 'text-pink-600',
    badge: 'IA'
  },
  
  // Life Management Section
  { 
    name: 'Budget', 
    href: '/budget', 
    icon: Wallet, 
    color: 'text-yellow-600',
    section: 'Vie étudiante'
  },
  { 
    name: 'Transport', 
    href: '/transport', 
    icon: MapPin, 
    color: 'text-red-600' 
  },
  { 
    name: 'Documents', 
    href: '/documents', 
    icon: FileText, 
    color: 'text-indigo-600' 
  },
  
  // Social Section
  { 
    name: 'Forum', 
    href: '/forum', 
    icon: MessageSquare, 
    color: 'text-teal-600',
    section: 'Collaboration'
  },
  { 
    name: 'Événements', 
    href: '/events', 
    icon: CalendarIcon, 
    color: 'text-orange-600' 
  },
];

const bottomNavigation = [
  { name: 'Profil', href: '/profile', icon: User },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2 mr-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">SmartCampus</h1>
            <p className="text-xs text-gray-500">FP Ouarzazate</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user?.first_name?.[0] || 'U'}{user?.last_name?.[0] || 'S'}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.first_name || 'Demo'} {user?.last_name || 'Student'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.level || 'L3'} {user?.filiere || 'INFO'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-1">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const isSection = item.section;
            
            return (
              <div key={item.name}>
                {/* Section Header */}
                {isSection && (
                  <div className="pt-4 pb-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {item.section}
                    </h3>
                  </div>
                )}
                
                {/* Navigation Item */}
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Link
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon 
                      className={`
                        mr-3 h-5 w-5 transition-colors
                        ${isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'}
                      `}
                    />
                    <span className="flex-1">{item.name}</span>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 w-1 h-full bg-blue-600 rounded-r-full"
                    />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all
                ${isActive 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              {item.name}
            </Link>
          );
        })}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};
