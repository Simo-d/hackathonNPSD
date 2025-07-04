import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { CheckCircle, Clock, AlertCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'task_completed' | 'project_updated' | 'deadline_approaching' | 'team_joined';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'task_completed',
    title: 'Tâche terminée',
    description: 'Conception de l\'interface utilisateur terminée par Sophie Bernard',
    timestamp: '2024-02-20T10:30:00Z',
    user: 'Sophie Bernard'
  },
  {
    id: '2',
    type: 'project_updated',
    title: 'Projet mis à jour',
    description: 'Plateforme E-commerce - Progression mise à jour à 65%',
    timestamp: '2024-02-20T09:15:00Z'
  },
  {
    id: '3',
    type: 'deadline_approaching',
    title: 'Échéance proche',
    description: 'Développement API REST - Échéance dans 3 jours',
    timestamp: '2024-02-20T08:00:00Z'
  },
  {
    id: '4',
    type: 'team_joined',
    title: 'Nouveau membre',
    description: 'Pierre Durand a rejoint l\'équipe Développement',
    timestamp: '2024-02-19T16:45:00Z',
    user: 'Pierre Durand'
  }
];

export const ActivityFeed: React.FC = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'project_updated':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'deadline_approaching':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'team_joined':
        return <User className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="p-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(activity.timestamp), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};