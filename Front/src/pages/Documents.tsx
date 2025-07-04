import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Share2, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Plus,
  Trash2,
  Edit,
  Star,
  ExternalLink,
  Archive,
  Bell,
  Tag
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Document {
  id: string;
  title: string;
  type: string;
  category: string;
  size: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending' | 'archived';
  isOfficial: boolean;
  isShared: boolean;
  tags: string[];
  description?: string;
  issuer?: string;
}

interface DocumentRequest {
  id: string;
  type: string;
  description: string;
  status: 'submitted' | 'processing' | 'ready' | 'delivered';
  requestDate: string;
  expectedDate?: string;
  urgency: boolean;
}

export const Documents: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'mydocs' | 'requests' | 'shared' | 'templates'>('mydocs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mock documents data
  const documents: Document[] = [
    {
      id: '1',
      title: 'Attestation de Scolarité 2024-2025',
      type: 'PDF',
      category: 'Attestation',
      size: '2.1 MB',
      uploadDate: '2025-01-15',
      expiryDate: '2025-12-31',
      status: 'active',
      isOfficial: true,
      isShared: false,
      tags: ['Officiel', 'Scolarité'],
      description: 'Attestation officielle pour l\'année universitaire en cours',
      issuer: 'Administration FP Ouarzazate'
    },
    {
      id: '2',
      title: 'Relevé de Notes S5',
      type: 'PDF',
      category: 'Relevé',
      size: '1.8 MB',
      uploadDate: '2025-01-10',
      status: 'active',
      isOfficial: true,
      isShared: true,
      tags: ['Notes', 'Semestre 5'],
      description: 'Relevé de notes du semestre 5',
      issuer: 'Scolarité'
    },
    {
      id: '3',
      title: 'Convention de Stage - TechCorp',
      type: 'PDF',
      category: 'Convention',
      size: '3.2 MB',
      uploadDate: '2025-01-08',
      expiryDate: '2025-06-30',
      status: 'active',
      isOfficial: true,
      isShared: false,
      tags: ['Stage', 'TechCorp'],
      description: 'Convention de stage de fin d\'études',
      issuer: 'Bureau des Stages'
    },
    {
      id: '4',
      title: 'Certificat Médical',
      type: 'JPG',
      category: 'Médical',
      size: '1.2 MB',
      uploadDate: '2025-01-05',
      expiryDate: '2025-01-20',
      status: 'expired',
      isOfficial: false,
      isShared: false,
      tags: ['Médical', 'Absence'],
      description: 'Certificat médical pour absence justifiée'
    },
    {
      id: '5',
      title: 'Carte d\'Étudiant 2024-2025',
      type: 'PNG',
      category: 'Carte',
      size: '0.8 MB',
      uploadDate: '2024-09-15',
      expiryDate: '2025-09-15',
      status: 'active',
      isOfficial: true,
      isShared: false,
      tags: ['Carte', 'Identification'],
      description: 'Carte d\'étudiant officielle'
    }
  ];

  const documentRequests: DocumentRequest[] = [
    {
      id: '1',
      type: 'Attestation de Scolarité',
      description: 'Attestation pour dossier de bourse',
      status: 'ready',
      requestDate: '2025-01-12',
      expectedDate: '2025-01-18',
      urgency: false
    },
    {
      id: '2',
      type: 'Relevé de Notes',
      description: 'Relevé complet des 4 semestres',
      status: 'processing',
      requestDate: '2025-01-10',
      expectedDate: '2025-01-20',
      urgency: true
    },
    {
      id: '3',
      type: 'Certificat de Scolarité',
      description: 'Certificat pour dossier de stage',
      status: 'submitted',
      requestDate: '2025-01-14',
      expectedDate: '2025-01-25',
      urgency: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous', icon: '📁', count: documents.length },
    { id: 'Attestation', name: 'Attestations', icon: '📜', count: 1 },
    { id: 'Relevé', name: 'Relevés', icon: '📊', count: 1 },
    { id: 'Convention', name: 'Conventions', icon: '📋', count: 1 },
    { id: 'Médical', name: 'Médical', icon: '🏥', count: 1 },
    { id: 'Carte', name: 'Cartes', icon: '🆔', count: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'expired': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      case 'ready': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-orange-600 bg-orange-50';
      case 'submitted': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'expired': return AlertTriangle;
      case 'pending': case 'processing': case 'submitted': return Clock;
      case 'ready': return CheckCircle;
      default: return FileText;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const TabButton: React.FC<{ 
    id: string; 
    label: string; 
    icon: React.ElementType; 
    active: boolean;
    badge?: number;
    onClick: () => void;
  }> = ({ id, label, icon: Icon, active, badge, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center px-4 py-2 rounded-lg font-medium transition-all relative
        ${active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }
      `}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
      {badge && badge > 0 && (
        <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
          {badge}
        </span>
      )}
    </motion.button>
  );

  const DocumentCard: React.FC<{ document: Document }> = ({ document }) => {
    const StatusIcon = getStatusIcon(document.status);
    const isExpiringSoon = document.expiryDate && 
      new Date(document.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{document.title}</h3>
              <p className="text-sm text-gray-600">{document.description}</p>
            </div>
          </div>
          {document.isOfficial && (
            <Star className="w-5 h-5 text-yellow-500" />
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Ajouté le {new Date(document.uploadDate).toLocaleDateString('fr-FR')}</span>
          </div>
          <span className="font-medium">{document.size}</span>
        </div>

        {document.expiryDate && (
          <div className={`flex items-center text-sm mb-4 ${
            isExpiringSoon ? 'text-red-600' : 'text-gray-600'
          }`}>
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>
              Expire le {new Date(document.expiryDate).toLocaleDateString('fr-FR')}
              {isExpiringSoon && ' (Bientôt)'}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {document.status === 'active' && 'Actif'}
            {document.status === 'expired' && 'Expiré'}
            {document.status === 'pending' && 'En attente'}
            {document.status === 'archived' && 'Archivé'}
          </div>
          <div className="flex items-center gap-2">
            {document.isShared && <Share2 className="w-4 h-4 text-blue-500" />}
            {document.isOfficial && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {document.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center">
            <Eye className="w-4 h-4 mr-1" />
            Voir
          </button>
          <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
            <Download className="w-4 h-4 mr-1" />
            Télécharger
          </button>
          <button className="bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const RequestCard: React.FC<{ request: DocumentRequest }> = ({ request }) => {
    const StatusIcon = getStatusIcon(request.status);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{request.type}</h3>
            <p className="text-sm text-gray-600">{request.description}</p>
          </div>
          {request.urgency && (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
              Urgent
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Demandé le {new Date(request.requestDate).toLocaleDateString('fr-FR')}</span>
          </div>
          {request.expectedDate && (
            <span>Prêt le {new Date(request.expectedDate).toLocaleDateString('fr-FR')}</span>
          )}
        </div>

        <div className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(request.status)}`}>
          <StatusIcon className="w-4 h-4 mr-2" />
          {request.status === 'submitted' && 'Soumise'}
          {request.status === 'processing' && 'En cours de traitement'}
          {request.status === 'ready' && 'Prête pour retrait'}
          {request.status === 'delivered' && 'Livrée'}
        </div>

        {request.status === 'ready' && (
          <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Télécharger le document
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <FileText className="w-8 h-8 mr-3" />
              Documents
            </h1>
            <p className="text-green-100 text-lg">
              Gérez tous vos documents administratifs en un seul endroit
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Archive className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              <p className="text-sm text-gray-600">Documents totaux</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Actifs</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === 'expired').length}
              </p>
              <p className="text-sm text-gray-600">Expirés</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documentRequests.filter(r => r.status === 'ready').length}
              </p>
              <p className="text-sm text-gray-600">Prêts</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-500" />
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
          id="mydocs"
          label="Mes Documents"
          icon={FileText}
          active={activeTab === 'mydocs'}
          onClick={() => setActiveTab('mydocs')}
        />
        <TabButton
          id="requests"
          label="Demandes"
          icon={Clock}
          active={activeTab === 'requests'}
          badge={documentRequests.filter(r => r.status === 'ready').length}
          onClick={() => setActiveTab('requests')}
        />
        <TabButton
          id="shared"
          label="Partagés"
          icon={Share2}
          active={activeTab === 'shared'}
          onClick={() => setActiveTab('shared')}
        />
        <TabButton
          id="templates"
          label="Modèles"
          icon={Archive}
          active={activeTab === 'templates'}
          onClick={() => setActiveTab('templates')}
        />
      </motion.div>

      {/* Content based on active tab */}
      {activeTab === 'mydocs' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Ajouter
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }
                `}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'requests' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Demandes de Documents</h2>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle demande
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'shared' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900">Documents Partagés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.filter(doc => doc.isShared).map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'templates' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900">Modèles de Documents</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Modèles disponibles</h3>
            <p className="text-gray-600 mb-4">
              Téléchargez des modèles pré-remplis pour vos demandes administratives
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Parcourir les modèles
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Documents;
