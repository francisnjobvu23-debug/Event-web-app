import React from 'react';

export default function UserCard({ user }) {
  if (!user) return null;

  return (
    <div className="card user-card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div className="avatar" style={{ width: 64, height: 64, borderRadius: 8, background: '#e6eefc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#234' }}>
        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>{user.name || user.email}</div>
            <div className="muted" style={{ fontSize: 12 }}>{user.email}</div>
          </div>
          <div className="role-tag" style={{ fontSize: 12, padding: '6px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.05)' }}>{user.role}</div>
        </div>
      </div>
    </div>
  );
}
