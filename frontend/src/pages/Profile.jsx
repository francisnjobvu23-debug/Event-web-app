import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import api from '../services/api';

export default function Profile() {
	const [bookings, setBookings] = useState([]);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('token');

		// Load current user
		api.getCurrentUser()
			.then(u => setUser(u))
			.catch(() => setUser(null));

		// Load bookings (falls back to legacy endpoint)
		fetch('/api/bookings/mine', { headers: { 'Authorization': token ? ('Bearer ' + token) : '' } })
			.then(r => r.json())
			.then(data => setBookings(data))
			.catch(() => setBookings([]));
	}, []);

	return (
		<div className="container">
			<h1>Your Profile</h1>
			<UserCard user={user} />

			<h2 style={{ marginTop: 18 }}>Your Bookings</h2>
			{bookings.length === 0 ? (
				<div className="card">You have no bookings yet.</div>
			) : (
				bookings.map(b => (
					<div key={b.id} className="card" style={{ marginBottom: 8 }}>
						<strong>{b.event?.title || 'Unknown Event'}</strong>
						<div>Seats: {b.seats} | Status: {b.status}</div>
						{b.receipt && <pre style={{ whiteSpace: 'pre-wrap' }}>{b.receipt}</pre>}
					</div>
				))
			)}
		</div>
	);
}
