import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Clock, 
  Star, 
  Target,
  Calendar,
  MessageSquare,
  Settings,
  TrendingUp,
  UserPlus,
  ChevronRight,
  Award,
  Sparkles,
  Plus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface StudyGroup {
  id: string;
  name: string;
  course: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
    level: string;
  }>;
  maxMembers: number;
  compatibilityScore: number;
  studyType: string;
  schedule: string;
  description: string;
  tags: string[];
  created: string;
}



export const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'create' | 'mygroups'>('discover');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    course: 'Intelligence Artificielle',
    maxMembers: 5,
    studyType: 'EXAM_PREP',
    meetingFrequency: 'WEEKLY',
    preferredTime: 'evening'
  });

  // Mock data for existing groups
  const suggestedGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'Groupe IA Avancée',
      course: 'Intelligence Artificielle',
      members: [
        { id: '1', name: 'Sarah K.', avatar: '👩‍💻', level: 'M1' },
        { id: '2', name: 'Youssef M.', avatar: '👨‍💻', level: 'M1' },
        { id: '3', name: 'Aicha B.', avatar: '👩‍🎓', level: 'L3' }
      ],
      maxMembers: 5,
      compatibilityScore: 94,
      studyType: 'Préparation examen',
      schedule: 'Mar/Jeu 18h-20h',
      description: 'Groupe focalisé sur les algorithmes de machine learning et deep learning',
      tags: ['Machine Learning', 'Python', 'TensorFlow'],
      created: '2025-01-15'
    },
    {
      id: '2',
      name: 'Algorithmes & Structures',
      course: 'Algorithmique',
      members: [
        { id: '4', name: 'Omar L.', avatar: '👨‍💼', level: 'L3' },
        { id: '5', name: 'Fatima Z.', avatar: '👩‍🔬', level: 'L3' }
      ],
      maxMembers: 4,
      compatibilityScore: 87,
      studyType: 'Devoirs',
      schedule: 'Lun/Mer 16h-18h',
      description: 'Résolution de problèmes algorithmiques et optimisation',
      tags: ['Complexité', 'Optimisation', 'C++'],
      created: '2025-01-10'
    },
    {
      id: '3',
      name: 'Python Masters',
      course: 'Programmation Avancée',
      members: [
        { id: '6', name: 'Reda T.', avatar: '👨‍🎨', level: 'L3' },
        { id: '7', name: 'Nadia H.', avatar: '👩‍💻', level: 'L3' },
        { id: '8', name: 'Karim S.', avatar: '👨‍🔬', level: 'L3' }
      ],
      maxMembers: 6,
      compatibilityScore: 82,
      studyType: 'Projet',
      schedule: 'Sam 14h-17h',
      description: 'Développement de projets Python et data science',
      tags: ['Python', 'Data Science', 'Django'],
      created: '2025-01-08'
    }
  ];

  const myGroups: StudyGroup[] = [
    {
      id: '4',
      name: 'Base de Données Pro',
      course: 'Systèmes de Gestion de BD',
      members: [
        { id: '1', name: user?.first_name || 'Vous', avatar: '👤', level: user?.level || 'L3' },
        { id: '9', name: 'Hajar M.', avatar: '👩‍💼', level: 'L3' },
        { id: '10', name: 'Amine K.', avatar: '👨‍💻', level: 'L3' }
      ],
      maxMembers: 5,
      compatibilityScore: 91,
      studyType: 'Cours',
      schedule: 'Ven 15h-17h',
      description: 'Maîtrise des concepts avancés de bases de données',
      tags: ['SQL', 'NoSQL', 'MongoDB'],
      created: '2025-01-05'
    }
  ];



  const TabButton: React.FC<{ 
    id: string; 
    label: string; 
    icon: React.ElementType; 
    active: boolean;
    onClick: () => void;
  }> = ({ id, label, icon: Icon, active, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center px-4 py-2 rounded-lg font-medium transition-all
        ${active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }
      `}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </motion.button>
  );

  const GroupCard: React.FC<{ group: StudyGroup; showJoinButton?: boolean }> = ({ 
    group, 
    showJoinButton = true 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{group.name}</h3>
          <p className="text-sm text-blue-600 font-medium">{group.course}</p>
        </div>
        <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
          <Sparkles className="w-3 h-3 mr-1" />
          {group.compatibilityScore}% match
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{group.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">
            {group.members.length}/{group.maxMembers} membres
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">{group.schedule}</span>
        </div>
      </div>

      <div className="flex -space-x-2 mb-4">
        {group.members.map((member, index) => (
          <div
            key={member.id}
            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white"
            title={`${member.name} - ${member.level}`}
          >
            {member.avatar}
          </div>
        ))}
        {group.members.length < group.maxMembers && (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
            <UserPlus className="w-4 h-4 text-gray-500" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {group.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {showJoinButton && (
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center">
          Rejoindre le groupe
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      )}
    </motion.div>
  );



  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Users className="w-8 h-8 mr-3" />
          Groupes d'Étude
          </h1>
          <p className="text-purple-100 text-lg">
          Rejoignez ou créez des groupes d'étude pour maximiser votre apprentissage
          </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2"
      >
        <TabButton
          id="discover"
          label="Découvrir"
          icon={Target}
          active={activeTab === 'discover'}
          onClick={() => setActiveTab('discover')}
        />
        <TabButton
          id="create"
          label="Créer un groupe"
          icon={Plus}
          active={activeTab === 'create'}
          onClick={() => setActiveTab('create')}
        />
        <TabButton
          id="mygroups"
          label="Mes Groupes"
          icon={Users}
          active={activeTab === 'mygroups'}
          onClick={() => setActiveTab('mygroups')}
        />

      </motion.div>

      {/* Content based on active tab */}
      {activeTab === 'discover' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Groupes recommandés</h2>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              Basé sur votre profil
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-500" />
              Créer un nouveau groupe d'étude
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du groupe
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Groupe IA Avancée"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Décrivez les objectifs et le style de travail du groupe..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matière
                  </label>
                  <select 
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                    <option value="Algorithmique">Algorithmique</option>
                    <option value="Programmation Avancée">Programmation Avancée</option>
                    <option value="Base de Données">Base de Données</option>
                    <option value="Réseaux">Réseaux</option>
                    <option value="Sécurité Informatique">Sécurité Informatique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre maximum de membres
                  </label>
                  <select 
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={3}>3 membres</option>
                    <option value={4}>4 membres</option>
                    <option value={5}>5 membres</option>
                    <option value={6}>6 membres</option>
                    <option value={8}>8 membres</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'étude
                  </label>
                  <select 
                    value={formData.studyType}
                    onChange={(e) => setFormData({...formData, studyType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EXAM_PREP">Préparation d'examen</option>
                    <option value="HOMEWORK">Devoirs</option>
                    <option value="PROJECT">Projets</option>
                    <option value="GENERAL">Étude générale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence des réunions
                  </label>
                  <select 
                    value={formData.meetingFrequency}
                    onChange={(e) => setFormData({...formData, meetingFrequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DAILY">Quotidienne</option>
                    <option value="WEEKLY">Hebdomadaire</option>
                    <option value="BIWEEKLY">Bi-hebdomadaire</option>
                    <option value="MONTHLY">Mensuelle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Créneaux préférés
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['morning', 'afternoon', 'evening', 'flexible'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData({...formData, preferredTime: time})}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        formData.preferredTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time === 'morning' && '🌅 Matin'}
                      {time === 'afternoon' && '☀️ Après-midi'}
                      {time === 'evening' && '🌙 Soir'}
                      {time === 'flexible' && '🔄 Flexible'}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Créer le groupe d'étude
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'mygroups' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Mes Groupes d'Étude</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
              <UserPlus className="w-4 h-4 mr-2" />
              Créer un groupe
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group) => (
              <GroupCard key={group.id} group={group} showJoinButton={false} />
            ))}
          </div>
        </motion.div>
      )}


    </div>
  );
};

export default StudyGroups;
