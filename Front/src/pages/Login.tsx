import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  BookOpen,
  Users,
  Calculator,
  MapPin,
  Zap
} from 'lucide-react';
import { useAuth, mockCredentials } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, directLogin, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      await login(username, password);
    }
  };

  const handleDirectLogin = (testUsername: string) => {
    directLogin(testUsername);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Emploi du temps intelligent",
      description: "Gestion automatisée de vos cours et devoirs"
    },
    {
      icon: Calculator,
      title: "Budget étudiant",
      description: "Suivez vos dépenses et optimisez votre budget"
    },
    {
      icon: MapPin,
      title: "Transport collaboratif",
      description: "Trouvez des options de transport en temps réel"
    },
    {
      icon: Users,
      title: "Groupes d'étude IA",
      description: "Matching intelligent pour vos groupes de révision"
    }
  ];

  const testAccounts = [
    {
      username: 'demo_student',
      name: 'Ahmed Benali',
      role: 'Étudiant L3 Info',
      description: 'Compte étudiant standard'
    },
    {
      username: 'student2',
      name: 'Fatima Idrissi',
      role: 'Étudiante L3 Info',
      description: 'Profil orienté étude individuelle'
    },
    {
      username: 'admin_user',
      name: 'Mohammed Alami',
      role: 'Étudiant M2 Info',
      description: 'Profil avancé avec toutes les fonctionnalités'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mb-8"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">SmartCampus</h1>
                <p className="text-blue-100">Faculté Polydisciplinaire de Ouarzazate</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Votre vie étudiante,
                <br />
                <span className="text-yellow-300">simplifiée et intelligente</span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Centralisez tous vos services universitaires et sociaux dans une seule plateforme moderne et intuitive.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-blue-100"
          >
            <p>© 2025 SmartCampus - Hack4Impact Hackathon</p>
          </motion.div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md"
          >
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SmartCampus</h1>
              <p className="text-gray-600">Connexion à votre espace étudiant</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bon retour !</h2>
                <p className="text-gray-600">Connectez-vous pour accéder à votre espace</p>
              </div>

              {/* Quick Access Section */}
              <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <Zap className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-bold text-green-900">🚀 Accès rapide (Test)</h3>
                </div>
                <p className="text-sm text-green-700 mb-3">Cliquez pour vous connecter directement :</p>
                
                <div className="space-y-2">
                  {testAccounts.map((account) => (
                    <button
                      key={account.username}
                      onClick={() => handleDirectLogin(account.username)}
                      disabled={isLoading}
                      className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-600">
                            {account.name}
                          </p>
                          <p className="text-xs text-gray-600">{account.role}</p>
                        </div>
                        <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Connexion →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Regular Login Form */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Ou connectez-vous manuellement :</h4>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="demo_student"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="demo123"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !username || !password}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>

              {/* Credentials Info */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-800 font-medium mb-2">💡 Identifiants de test :</p>
                <div className="text-xs text-gray-600 space-y-1">
                  {Object.entries(mockCredentials).map(([user, pass]) => (
                    <p key={user}>
                      <code className="bg-gray-100 px-1 rounded">{user}</code> : {' '}
                      <code className="bg-gray-100 px-1 rounded">{pass}</code>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
