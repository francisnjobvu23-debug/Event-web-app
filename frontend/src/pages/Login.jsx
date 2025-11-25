import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login({ email, password });
      localStorage.setItem('token', data.token);
      nav('/');
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: '40px auto', padding: '30px' }}>
        <h2>Login</h2>
        <form onSubmit={submit} className="spaced">
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
