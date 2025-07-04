import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  Search,
  Star,
  Heart,
  Share2,
  ExternalLink,
  User,
  BookOpen,
  Music,
  Trophy,
  Briefcase,
  GraduationCap,
  Target,
  Eye,
  MessageCircle,
  UserPlus,
  CheckCircle,
  X,
  Edit,
  Coffee,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEvents, useMyEvents, useAttendingEvents } from '../hooks/useEvents';
import type { Event } from '../types';

export const Events: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'create' | 'myEvents' | 'attending'>('discover');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Main events hook for discovery tab
  const {
    filteredEvents,
    loading: eventsLoading,
    error: eventsError,
    searchQuery,
    selectedFilter,
    setSearchQuery,
    setSelectedFilter,
    joinEvent,
    likeEvent,
    createEvent,
    refreshEvents
  } = useEvents();

  // My events hook
  const {
    events: myEvents,
    loading: myEventsLoading,
    error: myEventsError,
    refresh: refreshMyEvents
  } = useMyEvents();

  // Attending events hook
  const {
    events: attendingEvents,
    loading: attendingLoading,
    error: attendingError,
    refresh: refreshAttendingEvents
  } = useAttendingEvents();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'ACADEMIC',
    startDateTime: '',
    endDateTime: '',
    location: '',
    onlineLink: '',
    maxAttendees: 50,
    price: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');

  // Get current events based on active tab
  const getCurrentEvents = () => {
    switch (activeTab) {
      case 'discover':
        return filteredEvents;
      case 'myEvents':
        return myEvents;
      case 'attending':
        return attendingEvents;
      default:
        return [];
    }
  };

  // Get current loading state
  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'discover':
        return eventsLoading;
      case 'myEvents':
        return myEventsLoading;
      case 'attending':
        return attendingLoading;
      default:
        return false;
    }
  };

  // Get current error
  const getCurrentError = () => {
    switch (activeTab) {
      case 'discover':
        return eventsError;
      case 'myEvents':
        return myEventsError;
      case 'attending':
        return attendingError;
      default:
        return null;
    }
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Now we can safely call these functions
  const currentEvents = getCurrentEvents();
  const currentLoading = getCurrentLoading();
  const currentError = getCurrentError();

  // Event type configurations
  const eventTypeConfig = {
    ACADEMIC: { 
      icon: GraduationCap, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      label: 'Académique' 
    },
    SOCIAL: { 
      icon: Users, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      label: 'Social' 
    },
    STUDY_SESSION: { 
      icon: BookOpen, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100',
      label: 'Session d\'étude' 
    },
    WORKSHOP: { 
      icon: Target, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      label: 'Workshop' 
    },
    CONFERENCE: { 
      icon: Briefcase, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-100',
      label: 'Conférence' 
    },
    CULTURAL: { 
      icon: Music, 
      color: 'text-pink-600', 
      bgColor: 'bg-pink-100',
      label: 'Culturel' 
    },
    SPORTS: { 
      icon: Trophy, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      label: 'Sport' 
    },
    OTHER: { 
      icon: Coffee, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-100',
      label: 'Autre' 
    }
  };

  // Handle form submission
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createEvent(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        eventType: 'ACADEMIC',
        startDateTime: '',
        endDateTime: '',
        location: '',
        onlineLink: '',
        maxAttendees: 50,
        price: 0
      });
      
      // Switch to discover tab to see the new event
      setActiveTab('discover');
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle join/leave event
  const handleJoinEvent = async (eventId: string) => {
    try {
      await joinEvent(eventId);
      // Refresh relevant tabs
      if (activeTab === 'myEvents') {
        refreshMyEvents();
      }
      if (activeTab === 'attending') {
        refreshAttendingEvents();
      }
    } catch (error) {
      console.error('Failed to join event:', error);
    }
  };

  // Handle like event
  const handleLikeEvent = async (eventId: string) => {
    try {
      await likeEvent(eventId);
    } catch (error) {
      console.error('Failed to like event:', error);
    }
  };

  const TabButton: React.FC<{ 
    id: string; 
    label: string; 
    icon: React.ElementType; 
    active: boolean;
    count?: number;
    onClick: () => void;
  }> = ({ id, label, icon: Icon, active, count, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center px-4 py-2 rounded-lg font-medium transition-all relative
        ${active 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }
      `}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
          active ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
        }`}>
          {count}
        </span>
      )}
    </motion.button>
  );

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const config = eventTypeConfig[event.eventType];
    const IconComponent = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => setSelectedEvent(event)}
      >
        {/* Event Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{event.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <User className="w-4 h-4 mr-1" />
                <span>{event.organizer.name}</span>
                <span className="mx-2">•</span>
                <span>{event.organizer.level}</span>
              </div>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
              <IconComponent className="w-3 h-3 mr-1" />
              {config.label}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

          {/* Date & Time */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium">{formatDate(event.startDateTime)}</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1 text-green-500" />
            <span>{formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span>{event.location}</span>
            {event.onlineLink && (
              <>
                <span className="mx-2">•</span>
                <ExternalLink className="w-4 h-4 mr-1 text-purple-500" />
                <span className="text-purple-600">En ligne aussi</span>
              </>
            )}
          </div>

          {/* Attendees */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">
                {event.currentAttendees}
                {event.maxAttendees && `/${event.maxAttendees}`} participants
              </span>
              {event.isFull && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                  Complet
                </span>
              )}
            </div>
            {event.price && event.price > 0 && (
              <div className="text-sm font-bold text-green-600">
                {event.price} DH
              </div>
            )}
          </div>

          {/* Attendees Avatars */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex -space-x-2">
              {event.attendees.slice(0, 4).map((attendee, index) => (
                <div
                  key={attendee.id}
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm"
                  title={`${attendee.name} - ${attendee.level}`}
                >
                  {attendee.avatar}
                </div>
              ))}
              {event.currentAttendees > 4 && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white shadow-sm">
                  +{event.currentAttendees - 4}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{event.tags.length - 3}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeEvent(event.id);
                }}
                className={`flex items-center hover:text-red-500 transition-colors ${
                  event.isLiked ? 'text-red-500' : ''
                }`}
              >
                <Heart className="w-4 h-4 mr-1" fill={event.isLiked ? 'currentColor' : 'none'} />
                {event.likesCount}
              </button>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {event.commentsCount}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {event.viewsCount}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleJoinEvent(event.id);
              }}
              disabled={event.isFull}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                event.isFull
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {event.isFull ? 'Complet' : 'Participer'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const EventModal: React.FC<{ event: Event; onClose: () => void }> = ({ event, onClose }) => {
    const config = eventTypeConfig[event.eventType];
    const IconComponent = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${config.bgColor} ${config.color} w-fit mb-3`}>
              <IconComponent className="w-4 h-4 mr-2" />
              {config.label}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h2>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {event.organizer.avatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{event.organizer.name}</p>
                <p className="text-sm text-gray-600">{event.organizer.level}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">📅 Date et Heure</h3>
                <p className="text-gray-600 mb-2">{formatDate(event.startDateTime)}</p>
                <p className="text-gray-600">{formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">📍 Lieu</h3>
                <p className="text-gray-600">{event.location}</p>
                {event.onlineLink && (
                  <a 
                    href={event.onlineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center mt-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Lien en ligne
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">📝 Description</h3>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">✅ Prérequis</h3>
                <ul className="space-y-2">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                👥 Participants ({event.currentAttendees}
                {event.maxAttendees && `/${event.maxAttendees}`})
              </h3>
              <div className="flex flex-wrap gap-3">
                {event.attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center bg-gray-50 rounded-lg p-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2">
                      {attendee.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attendee.name}</p>
                      <p className="text-xs text-gray-500">{attendee.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            {event.price && event.price > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">💰 Prix</h3>
                <p className="text-2xl font-bold text-green-600">{event.price} DH</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <button
                  onClick={() => handleLikeEvent(event.id)}
                  className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                    event.isLiked ? 'text-red-500' : ''
                  }`}
                >
                  <Heart className="w-5 h-5" fill={event.isLiked ? 'currentColor' : 'none'} />
                  <span>{event.likesCount}</span>
                </button>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-5 h-5" />
                  <span>{event.commentsCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-5 h-5" />
                  <span>{event.viewsCount}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    // Handle share
                  }}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </button>
                <button
                  onClick={() => handleJoinEvent(event.id)}
                  disabled={event.isFull}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                    event.isFull
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {event.isFull ? 'Complet' : 'Participer'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Calendar className="w-10 h-10 mr-4" />
              Événements Étudiants
            </h1>
            <p className="text-purple-100 text-lg mb-4">
              Découvrez, organisez et participez aux événements de votre communauté étudiante
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{currentEvents.length} événements actifs</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                <span>Communauté de {currentEvents.reduce((acc, event) => acc + event.currentAttendees, 0)} participants</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des événements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tous les types</option>
            {Object.entries(eventTypeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(eventTypeConfig).map(([key, config]) => {
            const count = currentEvents.filter(event => event.eventType === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedFilter(selectedFilter === key ? 'ALL' : key)}
                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === key
                    ? `${config.bgColor} ${config.color}`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <config.icon className="w-4 h-4 mr-1" />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3"
      >
        <TabButton
          id="discover"
          label="🎯 Découvrir"
          icon={Target}
          active={activeTab === 'discover'}
          count={filteredEvents.length}
          onClick={() => setActiveTab('discover')}
        />
        <TabButton
          id="create"
          label="➕ Créer"
          icon={Plus}
          active={activeTab === 'create'}
          onClick={() => setActiveTab('create')}
        />
        <TabButton
          id="myEvents"
          label="📝 Mes Événements"
          icon={Edit}
          active={activeTab === 'myEvents'}
          count={myEvents.length}
          onClick={() => setActiveTab('myEvents')}
        />
        <TabButton
          id="attending"
          label="✅ Mes Participations"
          icon={CheckCircle}
          active={activeTab === 'attending'}
          count={attendingEvents.length}
          onClick={() => setActiveTab('attending')}
        />
      </motion.div>

      {/* Content */}
      {activeTab === 'discover' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('ALL');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un Nouvel Événement</h2>
          
          <form onSubmit={handleCreateEvent} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'événement
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Workshop React.js"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'événement
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(eventTypeConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez votre événement en détail..."
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de début
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={(e) => setFormData({...formData, startDateTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de fin
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDateTime}
                  onChange={(e) => setFormData({...formData, endDateTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Amphithéâtre A, Salle 101..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien en ligne (optionnel)
                </label>
                <input
                  type="url"
                  value={formData.onlineLink}
                  onChange={(e) => setFormData({...formData, onlineLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            </div>

            {/* Capacity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre maximum de participants
                </label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({...formData, maxAttendees: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (DH) - 0 pour gratuit
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    eventType: 'ACADEMIC',
                    startDateTime: '',
                    endDateTime: '',
                    location: '',
                    onlineLink: '',
                    maxAttendees: 50,
                    price: 0
                  });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                    Création...
                  </>
                ) : (
                  'Créer l\'Événement'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === 'myEvents' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Mes Événements Organisés</h2>
            <button
              onClick={() => setActiveTab('create')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Événement
            </button>
          </div>
          
          {currentLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
              <span className="text-gray-600">Chargement de vos événements...</span>
            </div>
          ) : myEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Edit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement organisé</h3>
              <p className="text-gray-600 mb-4">Commencez à organiser vos premiers événements !</p>
              <button
                onClick={() => setActiveTab('create')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Créer mon premier événement
              </button>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'attending' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Événements auxquels je participe</h2>
          
          {/* Error Message */}
          {currentError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-red-800 font-medium">Erreur de chargement</p>
                <p className="text-red-600 text-sm">{currentError}</p>
              </div>
              <button
                onClick={refreshAttendingEvents}
                className="ml-auto text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Loading State */}
          {currentLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
              <span className="text-gray-600">Chargement de vos participations...</span>
            </div>
          ) : attendingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attendingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune participation</h3>
              <p className="text-gray-600 mb-4">Rejoignez des événements pour enrichir votre expérience étudiante !</p>
              <button
                onClick={() => setActiveTab('discover')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Découvrir des événements
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default Events;
