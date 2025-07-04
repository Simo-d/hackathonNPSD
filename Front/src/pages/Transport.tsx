import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Car, Bus, Navigation } from 'lucide-react';

export const Transport: React.FC = () => {
  const availableRoutes = [
    {
      id: 1,
      from: 'Ouarzazate Centre',
      to: 'Faculté Polydisciplinaire',
      provider: 'Bus Universitaire',
      time: '07:30',
      price: 5,
      seats: 8,
      type: 'bus'
    },
    {
      id: 2,
      from: 'Hay Al Wahda',
      to: 'FP Ouarzazate',
      provider: 'Taxi Partagé',
      time: '08:00',
      price: 12,
      seats: 2,
      type: 'taxi'
    },
    {
      id: 3,
      from: 'Quartier Al Matar',
      to: 'Campus',
      provider: 'Covoiturage Étudiant',
      time: '07:45',
      price: 8,
      seats: 3,
      type: 'shared'
    }
  ];

  const sharedRides = [
    {
      organizer: 'Ahmed M.',
      from: 'Centre Ville',
      to: 'Faculté',
      time: '07:30',
      seats: 2,
      price: 10
    },
    {
      organizer: 'Fatima B.',
      from: 'Hay Essalam',
      to: 'Campus',
      time: '08:15',
      seats: 1,
      price: 15
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🚌 Transport</h1>
          <p className="text-gray-600 mt-1">Trouvez vos options de transport en temps réel</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
          <Navigation className="w-4 h-4 mr-2" />
          Planifier trajet
        </button>
      </motion.div>

      {/* Transport Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Rechercher un transport</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Départ</label>
            <input
              type="text"
              placeholder="Votre position"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <input
              type="text"
              placeholder="Faculté Polydisciplinaire"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Rechercher
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Routes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transports disponibles</h2>
          
          <div className="space-y-4">
            {availableRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {route.type === 'bus' && <Bus className="w-5 h-5 text-blue-600 mr-2" />}
                    {route.type === 'taxi' && <Car className="w-5 h-5 text-yellow-600 mr-2" />}
                    {route.type === 'shared' && <Users className="w-5 h-5 text-green-600 mr-2" />}
                    <span className="font-medium text-gray-900">{route.provider}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{route.price} DH</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{route.from} → {route.to}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{route.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{route.seats} places</span>
                  </div>
                </div>
                
                <button className="w-full mt-3 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors">
                  Réserver
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Shared Rides */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Trajets partagés</h2>
          
          <div className="space-y-4">
            {sharedRides.map((ride, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                      {ride.organizer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-gray-900">{ride.organizer}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{ride.price} DH</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{ride.from} → {ride.to}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{ride.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{ride.seats} place{ride.seats > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <button className="w-full mt-3 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors">
                  Rejoindre
                </button>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 border-2 border-dashed border-gray-300 text-gray-600 py-3 px-4 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors">
            + Proposer un trajet
          </button>
        </motion.div>
      </div>

      {/* Real-time Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <h3 className="font-bold text-blue-900">Mises à jour en temps réel</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-900">Bus Universitaire</p>
            <p className="text-green-600">À l'heure • Arrivée dans 5 min</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-900">Ligne Taxi 2</p>
            <p className="text-yellow-600">Retard de 10 min</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium text-gray-900">Covoiturage Ahmed</p>
            <p className="text-blue-600">En route • 2 places libres</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Transport;
