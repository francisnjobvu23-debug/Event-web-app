import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const events = await api.getEvents();
      setEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      await api.approveEvent(eventId);
      await loadEvents(); // Reload the events list
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.deleteEvent(eventId);
      await loadEvents(); // Reload the events list
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-events">
      <h1>Manage Events</h1>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>Organizer: {event.organizer.email}</p>
            <p>Status: {event.approved ? 'Approved' : 'Pending'}</p>
            <div className="event-actions">
              {!event.approved && (
                <button
                  onClick={() => handleApproveEvent(event.id)}
                  className="btn-approve"
                >
                  Approve Event
                </button>
              )}
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="btn-delete"
              >
                Delete Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}