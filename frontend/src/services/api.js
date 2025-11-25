const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  // Auth endpoints
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  signup: (userData) => request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  getCurrentUser: () => request('/auth/me'),

  // Events endpoints
  getEvents: () => request('/events'),
  
  getEvent: (id) => request(`/events/${id}`),
  
  createEvent: (eventData) => request('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),

  updateEvent: (id, eventData) => request(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),

  deleteEvent: (id) => request(`/events/${id}`, {
    method: 'DELETE',
  }),

  // RSVP endpoints
  rsvpToEvent: (eventId, status) => request(`/events/${eventId}/rsvp`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  }),

  // Admin endpoints
  getAdminStats: () => request('/admin/stats'),
  getPendingEvents: () => request('/admin/pending-events'),
  approveEvent: (eventId) => request(`/admin/events/${eventId}/approve`, {
    method: 'POST'
  }),
  getUsers: () => request('/admin/users'),
  updateUserRole: (userId, role) => request(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role })
  }),

  // Organizer endpoints
  getMyEvents: () => request('/organizer/events'),
  getOrganizerStats: () => request('/organizer/stats'),
  getEventRsvps: (eventId) => request(`/events/${eventId}/rsvps`),

  // Attendee endpoints
  getMyRsvps: () => request('/attendee/rsvps'),
  getUpcomingEvents: () => request('/events/upcoming'),
};

export default api;