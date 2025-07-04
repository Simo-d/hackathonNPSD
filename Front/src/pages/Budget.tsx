import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, TrendingUp, Plus, PieChart, Target } from 'lucide-react';

export const Budget: React.FC = () => {
  const expenses = [
    { category: 'Logement', amount: 1200, color: 'bg-blue-500', icon: '🏠' },
    { category: 'Restauration', amount: 800, color: 'bg-green-500', icon: '🍽️' },
    { category: 'Transport', amount: 300, color: 'bg-yellow-500', icon: '🚌' },
    { category: 'Livres', amount: 250, color: 'bg-purple-500', icon: '📚' },
    { category: 'Loisirs', amount: 200, color: 'bg-pink-500', icon: '🎯' }
  ];

  const recentTransactions = [
    { description: 'Supermarché Marjane', amount: -85, date: 'Aujourd\'hui', category: 'Restauration' },
    { description: 'Transport Bus', amount: -15, date: 'Hier', category: 'Transport' },
    { description: 'Bourse mensuelle', amount: +2500, date: '1 Juillet', category: 'Revenus' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💰 Budget Étudiant</h1>
          <p className="text-gray-600 mt-1">Gérez vos finances intelligemment</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter dépense
        </button>
      </motion.div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Budget restant</h3>
            <Wallet className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">2,450 DH</p>
          <p className="text-green-100 text-sm">Sur 4,000 DH ce mois</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dépenses ce mois</h3>
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">1,550 DH</p>
          <p className="text-red-600 text-sm">+12% par rapport au mois dernier</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Objectif épargne</h3>
            <Target className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">65%</p>
          <p className="text-blue-600 text-sm">650 DH sur 1,000 DH</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Dépenses par catégorie</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{expense.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{expense.category}</p>
                    <div className={`w-24 h-2 ${expense.color} rounded-full mt-1`}></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{expense.amount} DH</p>
                  <p className="text-sm text-gray-600">32% du budget</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transactions récentes</h2>
          
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.date} • {transaction.category}</p>
                </div>
                <div className={`font-bold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} DH
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
            Voir toutes les transactions →
          </button>
        </motion.div>
      </div>

      {/* Savings Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">💎 Objectif d'épargne</h2>
          <Target className="w-6 h-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-100 text-sm">Objectif : Nouveau laptop</p>
            <p className="text-2xl font-bold">8,000 DH</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Économisé</p>
            <p className="text-2xl font-bold">5,200 DH</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Reste à économiser</p>
            <p className="text-2xl font-bold">2,800 DH</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-white/20 rounded-full h-3">
            <div className="bg-white rounded-full h-3 w-3/5"></div>
          </div>
          <p className="text-blue-100 text-sm mt-2">65% de l'objectif atteint • 3 mois restants</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Budget;
