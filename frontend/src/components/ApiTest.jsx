import React, { useState, useEffect } from 'react';

export default function ApiTest() {
  const [status, setStatus] = useState('Checking connections...');
  const [dbStatus, setDbStatus] = useState('Checking database...');
  
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setStatus('API is connected');
        setDbStatus(data.database === 'connected' 
          ? 'Database is connected' 
          : 'Database connection failed');
      })
      .catch(err => {
        setStatus('API connection failed. Make sure backend is running on port 3001');
        setDbStatus('Database status unknown');
      });
  }, []);

  return (
    <div className="card" style={{ marginBottom: 20, padding: 20 }}>
      <h3>System Status</h3>
      <p style={{ color: status.includes('failed') ? 'red' : 'green' }}>{status}</p>
      <p style={{ color: dbStatus.includes('failed') ? 'red' : 'green' }}>{dbStatus}</p>
    </div>
  );
}