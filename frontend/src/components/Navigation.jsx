import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Navigation() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getCurrentUser()
        .then(user => setUserRole(user.role))
        .catch(() => {
          localStorage.removeItem('token');
          setUserRole(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">Community Events</Link>
      </div>
      
      <div className="nav-links">
        {!userRole ? (
          // Public routes
          <>
            <Link to="/events">Events</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          // Authenticated routes
          <>
            <Link to="/events">Events</Link>
            
            {userRole === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard">Admin Dashboard</Link>
                <Link to="/admin/users">Manage Users</Link>
                <Link to="/admin/events">Manage Events</Link>
              </>
            )}
            
            {userRole === 'ORGANIZER' && (
              <>
                <Link to="/organizer/dashboard">Organizer Dashboard</Link>
                <Link to="/organizer/my-events">My Events</Link>
                <Link to="/organizer/create-event">Create Event</Link>
              </>
            )}
            
            {userRole === 'ATTENDEE' && (
              <>
                <Link to="/attendee/dashboard">My Dashboard</Link>
                <Link to="/attendee/my-rsvps">My RSVPs</Link>
              </>
            )}
            
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}