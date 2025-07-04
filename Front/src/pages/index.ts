import React from 'react';

export const Documents: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">📄 Documents</h1>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">Gestion des documents administratifs en cours de développement...</p>
      </div>
    </div>
  );
};

export const StudyGroups: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">👥 Groupes d'étude</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">Formation et gestion des groupes d'étude en cours de développement...</p>
      </div>
    </div>
  );
};

export const Forum: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">💬 Forum</h1>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-800">Forum étudiant et discussions communautaires en cours de développement...</p>
      </div>
    </div>
  );
};

export const Events: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 Événements</h1>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">Gestion des événements étudiants en cours de développement...</p>
      </div>
    </div>
  );
};

export const Profile: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">👤 Profil</h1>
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-indigo-800">Gestion du profil étudiant en cours de développement...</p>
      </div>
    </div>
  );
};
