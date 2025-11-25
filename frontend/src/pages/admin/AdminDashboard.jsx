import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingApprovals: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAdminStats(),
      api.getPendingEvents()
    ])
      .then(([statsResp, events]) => {
        // backend returns totals; compute pending approvals from events length
        setStats({
          totalUsers: statsResp.totalUsers || 0,
          totalEvents: statsResp.totalEvents || 0,
          pendingApprovals: events ? events.length : 0
        });
        setRecentEvents(events);
      })
      .catch(error => console.error('Error loading admin dashboard:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleApproveEvent = async (eventId) => {
    try {
      await api.approveEvent(eventId);
      // Refresh pending events
      const events = await api.getPendingEvents();
      setRecentEvents(events);
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Events</h3>
          <p className="stat-number">{stats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p className="stat-number">{stats.pendingApprovals}</p>
        </div>
      </div>

      <div className="pending-events">
        <h2>Events Pending Approval</h2>
        {recentEvents.length === 0 ? (
          <p>No events pending approval</p>
        ) : (
          <div className="events-list">
            {recentEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Organizer: {event.organizer.email}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <button 
                  onClick={() => handleApproveEvent(event.id)}
                  className="btn-approve"
                >
                  Approve Event
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}