import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';

// Import pages directly with correct names
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Budget from './pages/Budget';
import Transport from './pages/Transport';
import Documents from './pages/Documents';
import StudyGroups from './pages/StudyGroups';
import Forum from './pages/Forum';
import Events from './pages/Events';
import Profile from './pages/Profile';
import AIMatching from './pages/AIMatching';
import IntelligentAssistant from './pages/IntelligentAssistant';

// Simple Settings component
const Settings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Paramètres</h1>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-gray-600">Configuration de l'application en cours de développement...</p>
    </div>
  </div>
);

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement de SmartCampus...</p>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-6">
            <h1 className="text-xl font-bold text-red-600 mb-2">Erreur de chargement</h1>
            <p className="text-gray-600 mb-4">Une erreur s'est produite lors du chargement de cette page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Recharger la page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-gray-600">Détails de l'erreur</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthProvider();
  
  if (isLoading) {
    return <Loading />;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const auth = useAuthProvider();

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={auth}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={
                auth.user ? <Navigate to="/" replace /> : <Login />
              } />
              
              <Route path="/register" element={
                auth.user ? <Navigate to="/" replace /> : <Register />
              } />
              
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout>
                    <ErrorBoundary>
                      <Routes>
                        {/* Dashboard */}
                        <Route path="/" element={<Dashboard />} />
                        
                        {/* Academic */}
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/study-groups" element={<StudyGroups />} />
                        <Route path="/ai-matching" element={<AIMatching />} />
                        <Route path="/intelligent-assistant" element={<IntelligentAssistant />} />
                        
                        {/* Life Management */}
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/transport" element={<Transport />} />
                        <Route path="/documents" element={<Documents />} />
                        
                        {/* Social */}
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/events" element={<Events />} />
                        
                        {/* Profile & Settings */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </ErrorBoundary>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
