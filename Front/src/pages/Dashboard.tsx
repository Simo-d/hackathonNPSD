import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Wallet, 
  MapPin, 
  FileText,
  Brain,
  TrendingUp,
  Clock,
  AlertCircle,
  Star,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  bgColor,
  trend = 'neutral'
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      {change && (
        <div className={`flex items-center text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {change}
        </div>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </motion.div>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  href 
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Link
      to={href}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${color} mr-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
    </Link>
  </motion.div>
);

interface UpcomingItemProps {
  title: string;
  time: string;
  type: 'course' | 'exam' | 'assignment' | 'event';
  priority?: 'high' | 'medium' | 'low';
}

const UpcomingItem: React.FC<UpcomingItemProps> = ({ title, time, type, priority = 'medium' }) => {
  const typeConfig = {
    course: { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    exam: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    assignment: { icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
    event: { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${config.bg} mr-3`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-600">{time}</p>
      </div>
      {priority === 'high' && (
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Cours cette semaine',
      value: 12,
      change: '+2',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up' as const
    },
    {
      title: 'Devoirs en attente',
      value: 5,
      change: '-3',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'down' as const
    },
    {
      title: 'Budget restant',
      value: '2,450 DH',
      change: '-12%',
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'down' as const
    },
    {
      title: 'Groupes d\'étude',
      value: 3,
      change: '+1',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up' as const
    }
  ];

  const quickActions = [
    {
      title: 'Nouveau groupe d\'étude',
      description: 'Utilisez l\'IA pour trouver des partenaires',
      icon: Brain,
      color: 'from-pink-500 to-purple-600',
      href: '/ai-matching'
    },
    {
      title: 'Ajouter une dépense',
      description: 'Suivez votre budget étudiant',
      icon: Wallet,
      color: 'from-green-500 to-teal-600',
      href: '/budget'
    },
    {
      title: 'Chercher un transport',
      description: 'Trouvez des options de trajet',
      icon: MapPin,
      color: 'from-red-500 to-orange-600',
      href: '/transport'
    },
    {
      title: 'Poster sur le forum',
      description: 'Posez vos questions à la communauté',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      href: '/forum'
    }
  ];

  const upcomingItems = [
    {
      title: 'Cours de Mathématiques',
      time: 'Aujourd\'hui à 14h00',
      type: 'course' as const
    },
    {
      title: 'Devoir Algorithmique',
      time: 'Demain à 23h59',
      type: 'assignment' as const,
      priority: 'high' as const
    },
    {
      title: 'Examen Physique',
      time: 'Vendredi à 08h00',
      type: 'exam' as const,
      priority: 'high' as const
    },
    {
      title: 'Session étude IA',
      time: 'Samedi à 15h00',
      type: 'event' as const
    }
  ];

  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour, {user?.first_name || 'Étudiant'} ! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {currentDate} • {currentTime}
            </p>
            <p className="text-blue-200 mt-2">
              Vous avez 3 tâches importantes aujourd'hui
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <QuickAction {...action} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">À venir</h2>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="space-y-1">
              {upcomingItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <UpcomingItem {...item} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4"
            >
              <Link
                to="/schedule"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Voir tout l'emploi du temps →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Activité récente</h2>
        
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="font-medium text-green-900">Devoir de Programmation soumis</p>
              <p className="text-sm text-green-700">Il y a 2 heures</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="font-medium text-blue-900">Nouveau groupe d'étude rejoint</p>
              <p className="text-sm text-blue-700">Hier à 16:30</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="font-medium text-purple-900">Profil étudiant mis à jour</p>
              <p className="text-sm text-purple-700">Il y a 3 jours</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
