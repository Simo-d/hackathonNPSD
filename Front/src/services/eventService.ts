import { apiRequest, API_ENDPOINTS } from './api';

// Type mappings from backend to frontend
export interface BackendEvent {
  id: string;
  title: string;
  description: string;
  event_type: 'ACADEMIC' | 'SOCIAL' | 'STUDY_SESSION' | 'WORKSHOP' | 'CONFERENCE' | 'CULTURAL' | 'SPORTS' | 'OTHER';
  organizer: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    level: string;
    profile_picture?: string;
  };
  start_datetime: string;
  end_datetime: string;
  location: string;
  online_link?: string;
  max_attendees?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  price?: number;
  requirements?: string[];
  created_at: string;
  updated_at: string;
  // Computed fields from backend
  current_attendees: number;
  is_full: boolean;
  available_spots: number;
  attendees: Array<{
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    level: string;
    profile_picture?: string;
  }>;
  tags: string[];
  is_liked: boolean;
  likes_count: number;
  comments_count: number;
  views_count: number;
}

// Transform backend event to frontend format
export const transformBackendEvent = (backendEvent: BackendEvent): import('../types').Event => {
  return {
    id: backendEvent.id,
    title: backendEvent.title,
    description: backendEvent.description,
    eventType: backendEvent.event_type,
    organizer: {
      id: backendEvent.organizer.id,
      name: `${backendEvent.organizer.first_name} ${backendEvent.organizer.last_name}`,
      avatar: backendEvent.organizer.profile_picture || getDefaultAvatar(backendEvent.organizer.first_name),
      level: backendEvent.organizer.level
    },
    startDateTime: backendEvent.start_datetime,
    endDateTime: backendEvent.end_datetime,
    location: backendEvent.location,
    onlineLink: backendEvent.online_link,
    maxAttendees: backendEvent.max_attendees,
    currentAttendees: backendEvent.current_attendees,
    status: backendEvent.status,
    isFull: backendEvent.is_full,
    availableSpots: backendEvent.available_spots,
    tags: backendEvent.tags,
    price: backendEvent.price,
    isLiked: backendEvent.is_liked,
    likesCount: backendEvent.likes_count,
    commentsCount: backendEvent.comments_count,
    viewsCount: backendEvent.views_count,
    attendees: backendEvent.attendees.map(attendee => ({
      id: attendee.id,
      name: `${attendee.first_name} ${attendee.last_name}`,
      avatar: attendee.profile_picture || getDefaultAvatar(attendee.first_name),
      level: attendee.level
    })),
    requirements: backendEvent.requirements,
    created: backendEvent.created_at
  };
};

// Generate default avatar based on name
const getDefaultAvatar = (firstName: string): string => {
  const avatars = ['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍🎨', '👩‍🎨'];
  const index = firstName.charCodeAt(0) % avatars.length;
  return avatars[index];
};

// Event API service
export class EventService {
  // Get all events
  static async getEvents(filters?: {
    search?: string;
    event_type?: string;
    page?: number;
    page_size?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.event_type && filters.event_type !== 'ALL') {
      queryParams.append('event_type', filters.event_type);
    }
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.page_size) queryParams.append('page_size', filters.page_size.toString());
    
    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.EVENTS}?${queryParams.toString()}`
      : API_ENDPOINTS.EVENTS;
    
    const response = await apiRequest(endpoint);
    
    // Handle paginated response
    if (response.results) {
      return {
        ...response,
        results: response.results.map(transformBackendEvent)
      };
    }
    
    // Handle non-paginated response
    return response.map(transformBackendEvent);
  }

  // Get single event
  static async getEvent(id: string) {
    const response = await apiRequest(`${API_ENDPOINTS.EVENTS}${id}/`);
    return transformBackendEvent(response);
  }

  // Create new event
  static async createEvent(eventData: {
    title: string;
    description: string;
    event_type: string;
    start_datetime: string;
    end_datetime: string;
    location: string;
    online_link?: string;
    max_attendees?: number;
    price?: number;
    requirements?: string[];
    tags?: string[];
  }) {
    const response = await apiRequest(API_ENDPOINTS.EVENTS, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return transformBackendEvent(response);
  }

  // Update event
  static async updateEvent(id: string, eventData: Partial<{
    title: string;
    description: string;
    event_type: string;
    start_datetime: string;
    end_datetime: string;
    location: string;
    online_link?: string;
    max_attendees?: number;
    price?: number;
    requirements?: string[];
    tags?: string[];
    status: string;
  }>) {
    const response = await apiRequest(`${API_ENDPOINTS.EVENTS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
    return transformBackendEvent(response);
  }

  // Delete event
  static async deleteEvent(id: string) {
    await apiRequest(`${API_ENDPOINTS.EVENTS}${id}/`, {
      method: 'DELETE',
    });
  }

  // Join event
  static async joinEvent(id: string) {
    const response = await apiRequest(API_ENDPOINTS.JOIN_EVENT(id), {
      method: 'POST',
    });
    return transformBackendEvent(response);
  }

  // Leave event
  static async leaveEvent(id: string) {
    const response = await apiRequest(API_ENDPOINTS.LEAVE_EVENT(id), {
      method: 'DELETE',
    });
    return transformBackendEvent(response);
  }

  // Like/Unlike event
  static async toggleLikeEvent(id: string) {
    const response = await apiRequest(API_ENDPOINTS.LIKE_EVENT(id), {
      method: 'POST',
    });
    return transformBackendEvent(response);
  }

  // Get user's events (organized)
  static async getMyEvents() {
    const response = await apiRequest(API_ENDPOINTS.MY_EVENTS);
    
    if (response.results) {
      return response.results.map(transformBackendEvent);
    }
    
    return response.map(transformBackendEvent);
  }

  // Get events user is attending
  static async getAttendingEvents() {
    const response = await apiRequest(`${API_ENDPOINTS.EVENTS}attending/`);
    
    if (response.results) {
      return response.results.map(transformBackendEvent);
    }
    
    return response.map(transformBackendEvent);
  }
}
