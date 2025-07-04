import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  Clock, 
  Star, 
  Heart,
  TrendingUp,
  MessageCircle,
  ChevronRight,
  Award,
  Sparkles,
  Search,
  Filter,
  Plus,
  Pin,
  CheckCircle,
  Eye,
  ThumbsUp,
  Reply,
  AlertCircle,
  Lightbulb,
  HelpCircle,
  Megaphone,
  Code,
  Calculator,
  Beaker,
  PenTool,
  Globe,
  Zap,
  Target,
  Send
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
    reputation: number;
  };
  category: {
    name: string;
    color: string;
    icon: string;
  };
  type: 'QUESTION' | 'DISCUSSION' | 'ANNOUNCEMENT' | 'STUDY_GROUP' | 'RESOURCE' | 'EVENT';
  isPinned: boolean;
  isSolved: boolean;
  viewsCount: number;
  likesCount: number;
  repliesCount: number;
  lastActivity: string;
  createdAt: string;
  tags: string[];
}

interface ForumReply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
    reputation: number;
  };
  likesCount: number;
  isAccepted: boolean;
  createdAt: string;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  topicCount: number;
  lastActivity: string;
}

export const Forum: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'discussions' | 'categories' | 'create'>('discussions');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');

  // Mock data for forum categories
  const categories: ForumCategory[] = [
    {
      id: 'all',
      name: 'Toutes les catégories',
      description: 'Voir toutes les discussions',
      icon: '💬',
      color: 'blue',
      topicCount: 156,
      lastActivity: 'Il y a 2 min'
    },
    {
      id: 'algorithms',
      name: 'Algorithmique',
      description: 'Questions sur les algorithmes et structures de données',
      icon: '🧮',
      color: 'purple',
      topicCount: 42,
      lastActivity: 'Il y a 5 min'
    },
    {
      id: 'ai',
      name: 'Intelligence Artificielle',
      description: 'Machine Learning, Deep Learning, IA',
      icon: '🤖',
      color: 'green',
      topicCount: 38,
      lastActivity: 'Il y a 10 min'
    },
    {
      id: 'programming',
      name: 'Programmation',
      description: 'Python, Java, C++, JavaScript et autres langages',
      icon: '💻',
      color: 'indigo',
      topicCount: 51,
      lastActivity: 'Il y a 15 min'
    },
    {
      id: 'databases',
      name: 'Bases de Données',
      description: 'SQL, NoSQL, design et optimisation',
      icon: '🗃️',
      color: 'orange',
      topicCount: 25,
      lastActivity: 'Il y a 30 min'
    },
    {
      id: 'general',
      name: 'Discussion Générale',
      description: 'Sujets divers liés aux études',
      icon: '💭',
      color: 'gray',
      topicCount: 89,
      lastActivity: 'Il y a 1h'
    }
  ];

  // Mock data for forum topics
  const topics: ForumTopic[] = [
    {
      id: '1',
      title: 'Comment optimiser un algorithme de tri pour de gros datasets ?',
      content: 'Je travaille sur un projet qui nécessite de trier des millions d\'entrées. Quel algorithme recommandez-vous ?',
      author: {
        name: 'Sarah Benali',
        avatar: '👩‍💻',
        level: 'M1',
        reputation: 245
      },
      category: {
        name: 'Algorithmique',
        color: 'purple',
        icon: '🧮'
      },
      type: 'QUESTION',
      isPinned: false,
      isSolved: false,
      viewsCount: 127,
      likesCount: 15,
      repliesCount: 8,
      lastActivity: 'Il y a 5 min',
      createdAt: '2025-01-04 14:30',
      tags: ['tri', 'performance', 'big-data']
    },
    {
      id: '2',
      title: '📌 Règles du forum et guide de bonnes pratiques',
      content: 'Bienvenue sur le forum SmartCampus ! Voici les règles à respecter pour une communauté harmonieuse...',
      author: {
        name: 'Admin SmartCampus',
        avatar: '👨‍💼',
        level: 'Admin',
        reputation: 1000
      },
      category: {
        name: 'Annonces',
        color: 'red',
        icon: '📢'
      },
      type: 'ANNOUNCEMENT',
      isPinned: true,
      isSolved: false,
      viewsCount: 456,
      likesCount: 32,
      repliesCount: 3,
      lastActivity: 'Il y a 1h',
      createdAt: '2025-01-01 09:00',
      tags: ['règles', 'guide', 'forum']
    },
    {
      id: '3',
      title: 'Ressources gratuites pour apprendre le Machine Learning',
      content: 'Collection de cours, livres et tutoriels gratuits pour débuter en ML. N\'hésitez pas à ajouter vos trouvailles !',
      author: {
        name: 'Youssef Idrissi',
        avatar: '👨‍🎓',
        level: 'L3',
        reputation: 189
      },
      category: {
        name: 'Intelligence Artificielle',
        color: 'green',
        icon: '🤖'
      },
      type: 'RESOURCE',
      isPinned: false,
      isSolved: false,
      viewsCount: 298,
      likesCount: 45,
      repliesCount: 12,
      lastActivity: 'Il y a 10 min',
      createdAt: '2025-01-03 16:45',
      tags: ['machine-learning', 'ressources', 'gratuit']
    },
    {
      id: '4',
      title: 'Groupe d\'étude pour l\'examen de Réseaux - Cherche 2-3 personnes',
      content: 'Salut ! Je forme un groupe pour réviser l\'examen de Réseaux. Niveau L3, planning flexible...',
      author: {
        name: 'Aicha Alaoui',
        avatar: '👩‍🎓',
        level: 'L3',
        reputation: 156
      },
      category: {
        name: 'Groupes d\'étude',
        color: 'blue',
        icon: '👥'
      },
      type: 'STUDY_GROUP',
      isPinned: false,
      isSolved: false,
      viewsCount: 89,
      likesCount: 7,
      repliesCount: 4,
      lastActivity: 'Il y a 25 min',
      createdAt: '2025-01-04 11:20',
      tags: ['réseaux', 'examen', 'groupe-étude']
    },
    {
      id: '5',
      title: 'Débat : Python vs Java pour débuter en programmation ?',
      content: 'Quel langage recommandez-vous pour quelqu\'un qui commence la programmation ? Arguments pour chaque côté !',
      author: {
        name: 'Omar Benjelloun',
        avatar: '👨‍💻',
        level: 'L2',
        reputation: 78
      },
      category: {
        name: 'Programmation',
        color: 'indigo',
        icon: '💻'
      },
      type: 'DISCUSSION',
      isPinned: false,
      isSolved: false,
      viewsCount: 203,
      likesCount: 28,
      repliesCount: 15,
      lastActivity: 'Il y a 45 min',
      createdAt: '2025-01-04 08:15',
      tags: ['python', 'java', 'débutant']
    }
  ];

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    type: 'DISCUSSION' as ForumTopic['type'],
    tags: ''
  });

  const [newReply, setNewReply] = useState('');

  const filteredTopics = topics.filter(topic => {
    const matchesCategory = selectedCategory === 'all' || topic.category.name.toLowerCase().includes(selectedCategory);
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likesCount + b.viewsCount) - (a.likesCount + a.viewsCount);
      case 'unanswered':
        return a.repliesCount - b.repliesCount;
      default: // recent
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    }
  });

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
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }
      `}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </motion.button>
  );

  const TopicCard: React.FC<{ topic: ForumTopic }> = ({ topic }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => setSelectedTopic(topic)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {topic.isPinned && <Pin className="w-4 h-4 text-red-500 mr-2" />}
            {topic.isSolved && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${topic.category.color}-50 text-${topic.category.color}-700`}>
              {topic.category.icon} {topic.category.name}
            </span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              topic.type === 'QUESTION' ? 'bg-orange-50 text-orange-700' :
              topic.type === 'ANNOUNCEMENT' ? 'bg-red-50 text-red-700' :
              topic.type === 'RESOURCE' ? 'bg-green-50 text-green-700' :
              topic.type === 'STUDY_GROUP' ? 'bg-blue-50 text-blue-700' :
              'bg-gray-50 text-gray-700'
            }`}>
              {topic.type === 'QUESTION' && '❓ Question'}
              {topic.type === 'ANNOUNCEMENT' && '📢 Annonce'}
              {topic.type === 'RESOURCE' && '📚 Ressource'}
              {topic.type === 'STUDY_GROUP' && '👥 Groupe'}
              {topic.type === 'DISCUSSION' && '💭 Discussion'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {topic.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{topic.content}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="text-right ml-4">
          <div className="flex items-center text-blue-600 font-bold mb-1">
            <Star className="w-4 h-4 mr-1" />
            {topic.author.reputation}
          </div>
          <p className="text-xs text-gray-500">Réputation</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm mr-2">
              {topic.author.avatar}
            </div>
            <span className="font-medium">{topic.author.name}</span>
            <span className="ml-1 text-xs">({topic.author.level})</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {topic.viewsCount}
          </div>
          <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {topic.likesCount}
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            {topic.repliesCount}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {topic.lastActivity}
        </div>
      </div>
    </motion.div>
  );

  const CategoryCard: React.FC<{ category: ForumCategory }> = ({ category }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => {
        setSelectedCategory(category.id);
        setActiveTab('discussions');
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center text-2xl mr-4`}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-600">
          <MessageSquare className="w-4 h-4 mr-1" />
          {category.topicCount} discussions
        </div>
        <div className="text-gray-500">
          {category.lastActivity}
        </div>
      </div>
    </motion.div>
  );

  if (selectedTopic) {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Retour au forum
        </button>

        {/* Topic Detail */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                {selectedTopic.isPinned && <Pin className="w-5 h-5 text-red-500 mr-2" />}
                {selectedTopic.isSolved && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${selectedTopic.category.color}-50 text-${selectedTopic.category.color}-700`}>
                  {selectedTopic.category.icon} {selectedTopic.category.name}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedTopic.title}</h1>
              <div className="prose max-w-none text-gray-700 mb-6">
                {selectedTopic.content}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedTopic.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg mr-3">
                  {selectedTopic.author.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedTopic.author.name}</p>
                  <p className="text-sm text-gray-600">{selectedTopic.author.level} • {selectedTopic.author.reputation} pts</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {selectedTopic.viewsCount}
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {selectedTopic.likesCount}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <ThumbsUp className="w-4 h-4 mr-2" />
                J'aime
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Reply className="w-4 h-4 mr-2" />
                Répondre
              </button>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Votre réponse</h3>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            placeholder="Écrivez votre réponse..."
          />
          <div className="flex justify-end mt-4">
            <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Send className="w-4 h-4 mr-2" />
              Publier la réponse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <MessageSquare className="w-10 h-10 mr-4" />
              Forum SmartCampus
            </h1>
            <p className="text-purple-100 text-lg mb-4">
              Partagez vos connaissances, posez vos questions et connectez-vous avec la communauté
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>+ de 500 membres actifs</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>156 discussions</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>24h en ligne</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3"
      >
        <TabButton
          id="discussions"
          label="💬 Discussions"
          icon={MessageSquare}
          active={activeTab === 'discussions'}
          onClick={() => setActiveTab('discussions')}
        />
        <TabButton
          id="categories"
          label="📂 Catégories"
          icon={BookOpen}
          active={activeTab === 'categories'}
          onClick={() => setActiveTab('categories')}
        />
        <TabButton
          id="create"
          label="✏️ Créer"
          icon={Plus}
          active={activeTab === 'create'}
          onClick={() => setActiveTab('create')}
        />
      </motion.div>

      {/* Search and Filters */}
      {activeTab === 'discussions' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Rechercher dans les discussions..."
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Plus récent</option>
              <option value="popular">Plus populaire</option>
              <option value="unanswered">Sans réponse</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'discussions' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {sortedTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
          
          {sortedTopics.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune discussion trouvée</h3>
              <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'categories' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {categories.filter(cat => cat.id !== 'all').map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer une nouvelle discussion</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la discussion
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez votre sujet en quelques mots..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.filter(cat => cat.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de discussion
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as ForumTopic['type']})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="QUESTION">❓ Question</option>
                  <option value="DISCUSSION">💭 Discussion</option>
                  <option value="RESOURCE">📚 Partage de ressource</option>
                  <option value="STUDY_GROUP">👥 Recherche groupe d'étude</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows={8}
                placeholder="Détaillez votre question, discussion ou partage..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ex: python, algorithme, débutant"
              />
            </div>

            <div className="flex justify-end">
              <button className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                <Send className="w-5 h-5 mr-2" />
                Publier la discussion
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Forum;
