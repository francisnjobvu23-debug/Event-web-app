import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AttendeeDashboard() {
  const [myRsvps, setMyRsvps] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMyRsvps(),
      api.getUpcomingEvents()
    ])
      .then(([rsvps, events]) => {
        setMyRsvps(rsvps);
        setUpcomingEvents(events);
      })
      .catch(error => console.error('Error loading attendee dashboard:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleRsvp = async (eventId, status) => {
    try {
      await api.rsvpToEvent(eventId, status);
      // Refresh RSVPs
      const updatedRsvps = await api.getMyRsvps();
      setMyRsvps(updatedRsvps);
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="attendee-dashboard">
      <h1>My Dashboard</h1>
      
      <div className="my-rsvps">
        <h2>My RSVPs</h2>
        {myRsvps.length === 0 ? (
          <p>You haven't RSVP'd to any events yet</p>
        ) : (
          <div className="rsvps-list">
            {myRsvps.map(rsvp => (
              <div key={rsvp.id} className="event-card">
                <h3>{rsvp.event.title}</h3>
                <p>{rsvp.event.description}</p>
                <p>Date: {new Date(rsvp.event.date).toLocaleDateString()}</p>
                <p>Location: {rsvp.event.location}</p>
                <p>Current Status: {rsvp.status}</p>
                <div className="rsvp-actions">
                  <button 
                    onClick={() => handleRsvp(rsvp.event.id, 'GOING')}
                    className={rsvp.status === 'GOING' ? 'active' : ''}
                  >
                    Going
                  </button>
                  <button 
                    onClick={() => handleRsvp(rsvp.event.id, 'MAYBE')}
                    className={rsvp.status === 'MAYBE' ? 'active' : ''}
                  >
                    Maybe
                  </button>
                  <button 
                    onClick={() => handleRsvp(rsvp.event.id, 'NOT_GOING')}
                    className={rsvp.status === 'NOT_GOING' ? 'active' : ''}
                  >
                    Not Going
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="upcoming-events">
        <h2>Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p>No upcoming events</p>
        ) : (
          <div className="events-list">
            {upcomingEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>
                <button 
                  onClick={() => handleRsvp(event.id, 'GOING')}
                  className="btn-rsvp"
                >
                  RSVP to this event
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}