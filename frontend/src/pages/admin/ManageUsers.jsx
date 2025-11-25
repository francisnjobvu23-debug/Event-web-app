import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers()
      .then(setUsers)
      .catch(error => console.error('Error loading users:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      // Refresh user list
      const updatedUsers = await api.getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-users">
      <h1>Manage Users</h1>
      <div className="users-list">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="ORGANIZER">Organizer</option>
                    <option value="ATTENDEE">Attendee</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}