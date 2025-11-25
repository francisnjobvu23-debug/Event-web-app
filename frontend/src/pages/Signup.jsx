import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw data;
      localStorage.setItem('token', data.token);
      nav('/');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: '40px auto', padding: '30px' }}>
        <h2>Signup</h2>
        <form onSubmit={submit} className="spaced">
          <div className="row" style={{ marginBottom: 16 }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              type="text"
              required
              style={{ width: '100%' }}
            />
          </div>
          <div className="row" style={{ marginBottom: 16 }}>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              style={{ width: '100%' }}
            />
          </div>
          <div className="row" style={{ marginBottom: 16 }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" className="btn btn-lg btn-primary" style={{ width: '100%' }}>
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
