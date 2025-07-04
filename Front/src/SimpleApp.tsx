import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple fallback components
const SimpleLogin = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">🎓 SmartCampus Login</h1>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Nom d'utilisateur" 
          className="w-full p-3 border rounded-lg"
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          className="w-full p-3 border rounded-lg"
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          Se connecter
        </button>
      </div>
    </div>
  </div>
);

const SimpleDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">📊 Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Cours</h3>
        <p className="text-3xl font-bold text-blue-600">12</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Devoirs</h3>
        <p className="text-3xl font-bold text-orange-600">5</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Budget</h3>
        <p className="text-3xl font-bold text-green-600">2,500€</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Groupes</h3>
        <p className="text-3xl font-bold text-purple-600">3</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/" element={<SimpleDashboard />} />
          <Route path="/*" element={<SimpleDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
