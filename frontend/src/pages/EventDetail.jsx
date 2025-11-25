import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Event not found.');
        return res.json();
      })
      .then(setEvent)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const onBook = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to book an event.');
        nav('/login');
        return;
      }
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ eventId: event.id, seats })
      });
      if (!res.ok) throw await res.json();
      alert('Booking successful!');
      nav('/profile');
    } catch (e) {
      alert(`Booking failed: ${e.error || 'Please try again.'}`);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container card" style={{ color: 'red' }}><h2>Error</h2><p>{error}</p></div>;
  if (!event) return <div className="container">Event not found.</div>;

  return <div className="container card"><h2>{event.title}</h2><p>{event.description}</p><p><b>When:</b> {new Date(event.startAt).toLocaleString()}</p><p><b>Location:</b> {event.location}</p><p><b>Price:</b> {event.priceCents === 0 ? 'Free' : `$${(event.priceCents / 100).toFixed(2)}`}</p><div><label>Seats: <input type="number" min="1" max="10" value={seats} onChange={e => setSeats(Number(e.target.value))} /></label><button onClick={onBook} style={{ marginLeft: 8 }}>Book</button></div></div>
}
