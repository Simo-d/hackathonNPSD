import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Brain, Sparkles, MessageCircle, Clock, BookOpen, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { openRouterService, ChatMessage, StudentContext } from '../services/openRouterService';
import { StudentContextService } from '../services/studentContextService';
import { useAuth } from '../hooks/useAuth';

const IntelligentAssistant: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Salut ! 👋 Je suis ton Assistant Intelligent SmartCampus. Je suis là pour t'aider dans tes études et ta vie étudiante à Ouarzazate.

🎯 Je peux t'aider avec :
• Planification de tes études et révisions
• Conseils budgétaires adaptés aux étudiants
• Stratégies d'apprentissage efficaces  
• Gestion du stress et motivation
• Formation de groupes d'étude
• Orientation et conseils de carrière

Pose-moi n'importe quelle question ! 😊`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [studentContext, setStudentContext] = useState<StudentContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions de questions rapides
  const quickQuestions = [
    "Comment mieux organiser mon temps d'étude ?",
    "Aide-moi à préparer mes examens",
    "Conseils pour gérer mon budget étudiant",
    "Comment former un groupe d'étude efficace ?",
    "Stratégies pour rester motivé(e)",
    "Que faire après mes études ?"
  ];

  // Charger le contexte étudiant
  useEffect(() => {
    if (user) {
      loadStudentContext();
    }
  }, [user]);

  const loadStudentContext = async () => {
    if (!user) return;

    try {
      // Utiliser le service pour charger le contexte complet
      const context = await StudentContextService.getStudentContext(user);
      setStudentContext(context);
    } catch (error) {
      console.error('Erreur lors du chargement du contexte:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await openRouterService.sendMessage(
        [...messages, userMessage],
        studentContext || undefined
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, je rencontre un problème technique. Peux-tu réessayer dans quelques instants ? 🙏',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Brain className="w-10 h-10 text-blue-600" />
              <Sparkles className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Assistant Intelligent</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Votre compagnon IA personnalisé pour exceller dans vos études et optimiser votre vie étudiante à Ouarzazate
          </p>
          
          {/* Contexte étudiant */}
          {user && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{user.first_name} {user.last_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{user.level} - {user.filiere}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Contexte personnalisé {studentContext ? 'activé' : 'en cours de chargement...'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Zone de chat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-start gap-3">
                      {message.role === 'assistant' && (
                        <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <User className="w-5 h-5 text-blue-200 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Indicateur de frappe */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-gray-600">L'assistant réfléchit...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions rapides */}
          {messages.length === 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-6 py-4 border-t border-gray-100"
            >
              <p className="text-sm text-gray-600 mb-3">💡 Questions populaires :</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    onClick={() => sendMessage(question)}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Zone de saisie */}
          <div className="p-6 border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pose ta question à l'assistant..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
                <MessageCircle className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
              </div>
              <motion.button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Envoyer</span>
              </motion.button>
            </form>
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              💡 L'assistant prend en compte vos informations personnelles pour des conseils adaptés
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Alimenté par GPT-4</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Contexte personnalisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Disponible 24/7</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntelligentAssistant;
