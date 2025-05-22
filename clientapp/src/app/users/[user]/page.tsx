"use client"
import { useAuth } from '@/app/context/authProvider';
import { useState, useEffect } from 'react';

// Define the types for our data structure
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
  const { token } = useAuth(); // Get the auth token
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Log token for debugging
  console.log("[DEBUG] Auth token:", token);

  // Extract userId from URL
  useEffect(() => {
    const path = window.location.pathname;
    console.log("[DEBUG] Current pathname:", path);

    const match = path.match(/\/users\/([^\/]+)$/);
    if (match && match[1]) {
      console.log("[DEBUG] Extracted userId:", match[1]);
      setUserId(match[1]);
    } else {
      console.warn("[DEBUG] Failed to extract userId from URL.");
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !token) {
        console.warn("[DEBUG] Missing userId or token. Skipping fetch.");
        return;
      }

      try {
        console.log("[DEBUG] Fetching user with ID:", userId);
        setLoading(true);

        const response = await fetch(`http://127.0.0.1:8080/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("[DEBUG] Fetch response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("[DEBUG] Fetched user data:", data);
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("[DEBUG] Error fetching user:", err);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const goBackToUsers = () => {
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Profile</h1>
        <button 
          onClick={goBackToUsers}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-white transition-colors"
        >
          Back to Users
        </button>
      </div>
      
      {error && (
        <div className="p-4 m-4 text-red-500 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="max-w-3xl mx-auto w-full bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        ) : user ? (
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
              <div className={`p-2 text-center text-white ${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-500'}`}>
                {user.role.toUpperCase()}
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.username}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">User Details</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">User ID:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{user.user_id}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Role:</span>
                        <span className="font-medium text-gray-800 dark:text-white capitalize">{user.role}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Account Created:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{formatDate(user.created_at)}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Account Activity</h3>
                    <div className="text-gray-600 dark:text-gray-300 text-center py-4">
                      No recent activity to display
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex border-t border-gray-200 dark:border-gray-700">
                <button 
                  className="w-full text-center py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-neutral-700 font-medium border-l border-gray-200 dark:border-gray-700"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="text-lg text-gray-600 dark:text-gray-300">User not found</div>
          </div>
        )}
      </div>
    </div>
  );
}
