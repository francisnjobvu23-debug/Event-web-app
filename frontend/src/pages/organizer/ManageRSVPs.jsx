import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function ManageRSVPs() {
  const { id } = useParams();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getEvent(id),
      api.getEventRsvps(id)
    ])
      .then(([eventData, rsvpData]) => {
        setEvent(eventData);
        setRsvps(rsvpData);
      })
      .catch(error => console.error('Error loading RSVPs:', error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-rsvps">
      <h1>Manage RSVPs - {event?.title}</h1>
      
      <div className="event-details">
        <p><strong>Date:</strong> {new Date(event?.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {event?.location}</p>
        <p><strong>Total RSVPs:</strong> {rsvps.length}</p>
      </div>

      <div className="rsvp-stats">
        <h2>RSVP Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Going</h3>
            <p className="stat-number">
              {rsvps.filter(rsvp => rsvp.status === 'GOING').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Maybe</h3>
            <p className="stat-number">
              {rsvps.filter(rsvp => rsvp.status === 'MAYBE').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Not Going</h3>
            <p className="stat-number">
              {rsvps.filter(rsvp => rsvp.status === 'NOT_GOING').length}
            </p>
          </div>
        </div>
      </div>

      <div className="rsvp-list">
        <h2>Attendee List</h2>
        <table>
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Status</th>
              <th>RSVP Date</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map(rsvp => (
              <tr key={rsvp.id}>
                <td>{rsvp.user.email}</td>
                <td>
                  <span className={`status-${rsvp.status.toLowerCase()}`}>
                    {rsvp.status}
                  </span>
                </td>
                <td>{new Date(rsvp.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}