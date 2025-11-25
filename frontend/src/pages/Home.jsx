import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ApiTest from '../components/ApiTest';
import api from '../services/api';

export default function Home(){
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvents()
      .then(setEvents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return <div className="container">
    <ApiTest />
    <h1>Community Events</h1>
    {error && <div className="card" style={{color: 'red'}}><h2>Error</h2><p>{error}</p></div>}
    {loading && <p>Loading events...</p>}
    <div className="events-grid">
      {!loading && !error && events.length === 0 && <p>No events found.</p>}
      {events.map(e=> (
        <div key={e.id} className="card">
          <div>
            <h3>{e.title}</h3>
            <p className="muted">{e.description?.slice(0,150)}</p>
          </div>
          <div className="row spaced">
            <Link to={`/event/${e.id}`} className="btn btn-sm btn-primary">View</Link>
            <span className="meta">{e.location} • {new Date(e.startAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
}
