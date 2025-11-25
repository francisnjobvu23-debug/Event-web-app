import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function OrganizerDashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMyEvents(),
      api.getOrganizerStats()
    ])
      .then(([events, stats]) => {
        setMyEvents(events);
        setStats(stats);
      })
      .catch(error => console.error('Error loading organizer dashboard:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="organizer-dashboard">
      <h1>Organizer Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p className="stat-number">{stats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Events</h3>
          <p className="stat-number">{stats.upcomingEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Total Attendees</h3>
          <p className="stat-number">{stats.totalAttendees}</p>
        </div>
      </div>

      <div className="my-events">
        <h2>My Events</h2>
        {myEvents.length === 0 ? (
          <p>You haven't created any events yet</p>
        ) : (
          <div className="events-list">
            {myEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Status: {event.approved ? 'Approved' : 'Pending Approval'}</p>
                <p>RSVPs: {event.rsvps.length}</p>
                <div className="event-actions">
                  <button onClick={() => navigate(`/organizer/events/${event.id}/edit`)}>
                    Edit Event
                  </button>
                  <button onClick={() => navigate(`/organizer/events/${event.id}/manage`)}>
                    Manage RSVPs
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}