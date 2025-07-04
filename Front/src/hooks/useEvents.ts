import { useState, useEffect, useCallback } from 'react';
import { EventService } from '../services/eventService';
import type { Event } from '../types';

interface UseEventsOptions {
  autoFetch?: boolean;
  filters?: {
    search?: string;
    event_type?: string;
  };
}

interface UseEventsReturn {
  events: Event[];
  filteredEvents: Event[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedFilter: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: string) => void;
  refreshEvents: () => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
  likeEvent: (eventId: string) => Promise<void>;
  createEvent: (eventData: any) => Promise<Event>;
}

export const useEvents = (options: UseEventsOptions = {}): UseEventsReturn => {
  const { autoFetch = true, filters = {} } = options;
  
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedFilter, setSelectedFilter] = useState(filters.event_type || 'ALL');

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await EventService.getEvents({
        search: searchQuery || undefined,
        event_type: selectedFilter !== 'ALL' ? selectedFilter : undefined,
      });
      
      // Handle both paginated and non-paginated responses
      const eventsData = Array.isArray(response) ? response : response.results || [];
      setEvents(eventsData);
      
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedFilter]);

  // Filter events locally (for immediate UI feedback)
  useEffect(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query)) ||
        event.organizer.name.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(event => event.eventType === selectedFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedFilter]);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [fetchEvents, autoFetch]);

  // Action handlers
  const handleJoinEvent = async (eventId: string) => {
    try {
      setError(null);
      const updatedEvent = await EventService.joinEvent(eventId);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? updatedEvent : event
        )
      );
      
    } catch (err) {
      console.error('Error joining event:', err);
      setError(err instanceof Error ? err.message : 'Failed to join event');
      throw err;
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      setError(null);
      const updatedEvent = await EventService.leaveEvent(eventId);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? updatedEvent : event
        )
      );
      
    } catch (err) {
      console.error('Error leaving event:', err);
      setError(err instanceof Error ? err.message : 'Failed to leave event');
      throw err;
    }
  };

  const handleLikeEvent = async (eventId: string) => {
    try {
      setError(null);
      const updatedEvent = await EventService.toggleLikeEvent(eventId);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? updatedEvent : event
        )
      );
      
    } catch (err) {
      console.error('Error liking event:', err);
      setError(err instanceof Error ? err.message : 'Failed to like event');
      throw err;
    }
  };

  const handleCreateEvent = async (eventData: any): Promise<Event> => {
    try {
      setError(null);
      setLoading(true);
      
      // Transform form data to backend format
      const backendEventData = {
        title: eventData.title,
        description: eventData.description,
        event_type: eventData.eventType,
        start_datetime: eventData.startDateTime,
        end_datetime: eventData.endDateTime,
        location: eventData.location,
        online_link: eventData.onlineLink || undefined,
        max_attendees: eventData.maxAttendees || undefined,
        price: eventData.price || undefined,
        requirements: eventData.requirements || [],
        tags: eventData.tags || [],
      };
      
      const newEvent = await EventService.createEvent(backendEventData);
      
      // Add to local state
      setEvents(prevEvents => [newEvent, ...prevEvents]);
      
      return newEvent;
      
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    filteredEvents,
    loading,
    error,
    searchQuery,
    selectedFilter,
    setSearchQuery,
    setSelectedFilter,
    refreshEvents: fetchEvents,
    joinEvent: handleJoinEvent,
    leaveEvent: handleLeaveEvent,
    likeEvent: handleLikeEvent,
    createEvent: handleCreateEvent,
  };
};

// Hook for user's organized events
export const useMyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const myEvents = await EventService.getMyEvents();
      setEvents(myEvents);
    } catch (err) {
      console.error('Error fetching my events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  return {
    events,
    loading,
    error,
    refresh: fetchMyEvents,
  };
};

// Hook for events user is attending
export const useAttendingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendingEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const attendingEvents = await EventService.getAttendingEvents();
      setEvents(attendingEvents);
    } catch (err) {
      console.error('Error fetching attending events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attending events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendingEvents();
  }, [fetchAttendingEvents]);

  return {
    events,
    loading,
    error,
    refresh: fetchAttendingEvents,
  };
};
