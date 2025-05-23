"use client";
import { useAuth } from '@/app/context/authProvider';
import { useState, useEffect } from 'react';

type UserLink = {
  self: string;
};

type User = {
  _links: UserLink;
  created_at: string;
  email: string;
  role: "admin" | "member";
  user_id: string;
  username: string;
};

export default function UserProfile() {
  const { token } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{ username: string; email: string }>({ username: "", email: "" });

  useEffect(() => {
    const match = window.location.pathname.match(/\/users\/([^\/]+)$/);
    if (match?.[1]) setUserId(match[1]);
  }, []);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8080/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setUser(data);
        setFormData({ username: data.username, email: data.email });
      } catch (err) {
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleDelete = async () => {
    if (!userId || !token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8080/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed.");
      alert("User deleted successfully.");
      window.location.href = '/users'; // or desired redirect
    } catch {
      alert("Failed to delete user.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8080/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed.");
      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch {
      alert("Failed to update user.");
    }
  };

  const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(date));

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : user ? (
        <div className="space-y-4">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 block w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full p-2 border rounded"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div><strong>Username:</strong> {user.username}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Role:</strong> {user.role}</div>
              <div><strong>Created:</strong> {formatDate(user.created_at)}</div>

              <div className="flex space-x-2 mt-4">
                <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
}
