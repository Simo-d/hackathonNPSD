import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Users, 
  BookOpen, 
  Clock, 
  Star, 
  Target,
  Calendar,
  MessageSquare,
  Settings,
  Zap,
  TrendingUp,
  UserPlus,
  ChevronRight,
  Award,
  Sparkles,
  BarChart3,
  Activity,
  CheckCircle,
  Heart,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';



interface MatchingResult {
  student: {
    name: string;
    level: string;
    compatibility: number;
    commonInterests: string[];
    scheduleOverlap: number;
    studyStyle: string;
    avatar: string;
  };
  reasons: string[];
  matchFactors: {
    schedule: number;
    academic: number;
    personality: number;
    communication: number;
  };
}

export const AIMatching: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'create' | 'preferences'>('discover');
  const [isMatching, setIsMatching] = useState(false);
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [preferences, setPreferences] = useState({
    studyType: 'EXAM_PREP',
    groupSize: 4,
    timePreference: 'evening',
    studyStyle: 'collaborative',
    subjects: ['Algorithmique', 'Intelligence Artificielle'],
    importance: {
      schedule: 40,
      academic: 30,
      personality: 20,
      communication: 10
    }
  });

  // Mock data for study recommendations and tips
  const studyTips = [
    {
      id: '1',
      title: 'Technique Pomodoro Avancée',
      description: 'Optimisez vos sessions d\'étude avec des cycles de 25 min + 5 min de pause',
      category: 'Productivité',
      icon: '⏱️',
      effectiveness: 92
    },
    {
      id: '2', 
      title: 'Mind Mapping pour l\'IA',
      description: 'Visualisez les concepts complexes d\'intelligence artificielle',
      category: 'Mémorisation',
      icon: '🧠',
      effectiveness: 88
    },
    {
      id: '3',
      title: 'Révision Active',
      description: 'Enseignez vos concepts à haute voix pour mieux les retenir',
      category: 'Révision',
      icon: '🗣️',
      effectiveness: 85
    }
  ];

  const runAIMatching = async () => {
    setIsMatching(true);
    setMatchingProgress(0);
    
    const steps = [
      'Analyse de votre profil étudiant...',
      'Collecte des données de compatibilité...',
      'Calcul des scores d\'emploi du temps...',
      'Évaluation des affinités académiques...',
      'Analyse des styles d\'apprentissage...',
      'Application des algorithmes de clustering...',
      'Génération des recommandations...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setMatchingProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    const mockResults: MatchingResult[] = [
      {
        student: {
          name: 'Sarah Benali',
          level: 'M1 Informatique',
          compatibility: 94,
          commonInterests: ['Machine Learning', 'Python', 'Recherche', 'Deep Learning'],
          scheduleOverlap: 85,
          studyStyle: 'Collaborative & Analytique',
          avatar: '👩‍💻'
        },
        reasons: [
          'Emplois du temps compatibles à 85% (créneaux libres communs)',
          'Passion commune pour l\'IA et le Machine Learning',
          'Complémentarité parfaite des compétences techniques',
          'Objectifs académiques et de carrière très similaires',
          'Même approche méthodologique de l\'apprentissage'
        ],
        matchFactors: {
          schedule: 85,
          academic: 96,
          personality: 92,
          communication: 88
        }
      },
      {
        student: {
          name: 'Youssef Idrissi',
          level: 'L3 Informatique',
          compatibility: 89,
          commonInterests: ['Algorithmique', 'Competitive Programming', 'Mathematics'],
          scheduleOverlap: 78,
          studyStyle: 'Structuré & Rigoureux',
          avatar: '👨‍💻'
        },
        reasons: [
          'Excellence reconnue en algorithmique et mathématiques',
          'Préférences d\'horaires d\'étude très similaires',
          'Approche méthodique et rigoureuse de l\'étude',
          'Expérience en programmation compétitive (ACM, Codeforces)',
          'Capacité à expliquer des concepts complexes clairement'
        ],
        matchFactors: {
          schedule: 78,
          academic: 94,
          personality: 86,
          communication: 90
        }
      },
      {
        student: {
          name: 'Aicha Alaoui',
          level: 'L3 Informatique', 
          compatibility: 86,
          commonInterests: ['Web Development', 'UI/UX', 'Design Thinking', 'Frontend'],
          scheduleOverlap: 72,
          studyStyle: 'Créatif & Visuel',
          avatar: '👩‍🎓'
        },
        reasons: [
          'Compétences complémentaires en design et interface utilisateur',
          'Même niveau d\'études avec progression similaire',
          'Approche créative et innovante des projets techniques',
          'Disponibilité préférentielle en soirée comme vous',
          'Expérience en travail collaboratif sur projets web'
        ],
        matchFactors: {
          schedule: 72,
          academic: 88,
          personality: 94,
          communication: 85
        }
      },
      {
        student: {
          name: 'Omar Benjelloun',
          level: 'M1 Informatique',
          compatibility: 83,
          commonInterests: ['Data Science', 'Statistics', 'R', 'Business Intelligence'],
          scheduleOverlap: 69,
          studyStyle: 'Analytique & Pratique',
          avatar: '👨‍📊'
        },
        reasons: [
          'Expertise complémentaire en analyse de données',
          'Solide background en statistiques et mathématiques',
          'Expérience en projets de Business Intelligence',
          'Approche pragmatique et orientée résultats',
          'Excellente capacité de synthèse et présentation'
        ],
        matchFactors: {
          schedule: 69,
          academic: 91,
          personality: 79,
          communication: 87
        }
      }
    ];
    
    setMatchingResults(mockResults);
    setCurrentStep('Matching terminé avec succès !');
    setIsMatching(false);
  };

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



  const MatchingResultCard: React.FC<{ result: MatchingResult }> = ({ result }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3 shadow-lg">
            {result.student.avatar}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{result.student.name}</h3>
            <p className="text-sm text-gray-600">{result.student.level}</p>
            <p className="text-xs text-blue-600 font-medium">{result.student.studyStyle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-green-600 font-bold text-lg">
            <Star className="w-5 h-5 mr-1" />
            {result.student.compatibility}%
          </div>
          <p className="text-xs text-gray-500">Compatibilité globale</p>
        </div>
      </div>

      {/* Detailed compatibility breakdown */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Facteurs de compatibilité</h4>
        <div className="space-y-2">
          {Object.entries(result.matchFactors).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 capitalize">
                {key === 'schedule' && '📅 Emploi du temps'}
                {key === 'academic' && '🎓 Académique'}
                {key === 'personality' && '🧠 Personnalité'}
                {key === 'communication' && '💬 Communication'}
              </span>
              <div className="flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-700 w-8">{value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-semibold">Intérêts communs</p>
        <div className="flex flex-wrap gap-1">
          {result.student.commonInterests.map((interest) => (
            <span
              key={interest}
              className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-semibold">Pourquoi ce match est parfait ?</p>
        <ul className="space-y-1">
          {result.reasons.slice(0, 3).map((reason, index) => (
            <li key={index} className="text-xs text-gray-600 flex items-start">
              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
          💬 Contacter
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
          👤 Voir profil
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header with enhanced design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Brain className="w-10 h-10 mr-4 animate-pulse" />
              Matching IA Avancé
            </h1>
            <p className="text-purple-100 text-lg mb-4">
              Algorithmes d'intelligence artificielle pour trouver vos partenaires d'étude parfaits
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                <span>+ de 1000 matchs réussis</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                <span>Précision de 94%</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3"
      >
        <TabButton
          id="discover"
          label="🎯 Recommandations"
          icon={Target}
          active={activeTab === 'discover'}
          onClick={() => setActiveTab('discover')}
        />
        <TabButton
          id="create"
          label="🤖 Matching IA"
          icon={Brain}
          active={activeTab === 'create'}
          onClick={() => setActiveTab('create')}
        />

        <TabButton
          id="preferences"
          label="⚙️ Préférences"
          icon={Settings}
          active={activeTab === 'preferences'}
          onClick={() => setActiveTab('preferences')}
        />
      </motion.div>

      {/* Content based on active tab */}
      {activeTab === 'discover' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recommandations d\'Étude Personnalisées</h2>
            <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
              <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
              Basé sur votre profil d\'apprentissage
            </div>
          </div>
          
          {/* Study Tips Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Techniques d\'Étude Recommandées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyTips.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{tip.icon}</div>
                    <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3 h-3 mr-1" />
                      {tip.effectiveness}%
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{tip.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                      {tip.category}
                    </span>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                      En savoir plus →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule Optimization */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Optimisation de Planning Suggérée
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Créneaux Optimaux Détectés</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">🌅 Lundi 8h-10h</span>
                    <span className="text-xs text-green-600 font-bold">Productivité élevée</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">🌙 Mercredi 18h-20h</span>
                    <span className="text-xs text-blue-600 font-bold">Focus optimal</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">☀️ Vendredi 14h-16h</span>
                    <span className="text-xs text-purple-600 font-bold">Créativité maximale</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Recommandations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Planifiez les matières difficiles le matin
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Réservez 20 min pour les révisions quotidiennes
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Alternez entre théorie et pratique chaque heure
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-yellow-500" />
              Intelligence Artificielle de Matching
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Notre système d'IA avancé analyse plus de 50 paramètres pour vous proposer 
              les partenaires d'étude les plus compatibles selon vos objectifs académiques.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Calendar className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Emploi du temps</h3>
                <p className="text-sm text-gray-600">Analyse des créneaux libres et préférences horaires</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <BookOpen className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Académique</h3>
                <p className="text-sm text-gray-600">Niveau, filière et performance académique</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <Heart className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Affinités</h3>
                <p className="text-sm text-gray-600">Centres d\'intérêt et objectifs communs</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <MessageSquare className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Communication</h3>
                <p className="text-sm text-gray-600">Style de communication et collaboration</p>
              </div>
            </div>

            {isMatching && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-blue-900 flex items-center">
                    <Brain className="w-5 h-5 mr-2 animate-pulse" />
                    IA en cours d'analyse...
                  </h3>
                  <span className="text-blue-700 font-bold">{Math.round(matchingProgress)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${matchingProgress}%` }}
                  ></div>
                </div>
                <p className="text-blue-800 text-sm">{currentStep}</p>
              </div>
            )}

            <button
              onClick={runAIMatching}
              disabled={isMatching}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg"
            >
              {isMatching ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6 mr-3" />
                  🚀 Lancer le Matching IA Avancé
                </>
              )}
            </button>
          </div>

          {matchingResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-yellow-500" />
                  Partenaires d\'Étude Recommandés
                </h3>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold">
                  ✨ {matchingResults.length} partenaires compatibles trouvés
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingResults.map((result, index) => (
                  <MatchingResultCard key={index} result={result} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}



      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Préférences de Matching IA</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Type d'étude préféré
                </label>
                <select 
                  value={preferences.studyType}
                  onChange={(e) => setPreferences({...preferences, studyType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="EXAM_PREP">🎯 Préparation d'examen</option>
                  <option value="HOMEWORK">📝 Devoirs et exercices</option>
                  <option value="PROJECT">🚀 Projets collaboratifs</option>
                  <option value="GENERAL">📚 Étude générale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Taille de groupe idéale: {preferences.groupSize} personnes
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={preferences.groupSize}
                  onChange={(e) => setPreferences({...preferences, groupSize: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>2 personnes</span>
                  <span className="font-bold text-blue-600">{preferences.groupSize} personnes</span>
                  <span>8 personnes</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Créneaux horaires préférés
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'morning', label: '🌅 Matin (8h-12h)', icon: '🌅' },
                    { id: 'afternoon', label: '☀️ Après-midi (14h-18h)', icon: '☀️' },
                    { id: 'evening', label: '🌙 Soir (18h-22h)', icon: '🌙' },
                    { id: 'flexible', label: '🔄 Flexible', icon: '🔄' }
                  ].map((time) => (
                    <button
                      key={time.id}
                      onClick={() => setPreferences({...preferences, timePreference: time.id})}
                      className={`p-4 rounded-xl text-sm font-medium transition-all ${
                        preferences.timePreference === time.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Importance des facteurs de matching (%)
                </label>
                <div className="space-y-4">
                  {Object.entries(preferences.importance).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key === 'schedule' && '📅 Emploi du temps'}
                          {key === 'academic' && '🎓 Niveau académique'}
                          {key === 'personality' && '🧠 Personnalité'}
                          {key === 'communication' && '💬 Communication'}
                        </span>
                        <span className="text-sm font-bold text-blue-600">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setPreferences({
                          ...preferences, 
                          importance: {
                            ...preferences.importance,
                            [key]: parseInt(e.target.value)
                          }
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg">
                💾 Sauvegarder les préférences
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIMatching;
