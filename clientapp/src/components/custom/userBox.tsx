
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

type ApiResponse = {
  _links: {
    [key: string]: any;
  };
  users: User[];
};

export default function UserGrid() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API endpoint
        // For demo purposes, we're simulating the API response
        const response = await fetch('http://127.0.0.1:8080/users/');
        const data: ApiResponse = await response.json();
        setUsers(data.users);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
      </div>
      
      {error && (
        <div className="p-4 m-4 text-red-500 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className={`p-1 text-center text-white ${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-500'}`}>
                  {user.role.toUpperCase()}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{user.username}</h2>
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600 dark:text-gray-300 truncate">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">ID:</span> 
                      <span className="text-xs ml-1">{user.user_id.substring(0, 8)}...</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Created:</span> 
                      <span className="ml-1">{formatDate(user.created_at)}</span>
                    </p>
                  </div>
                </div>
                <div className="flex border-t border-gray-200 dark:border-gray-700">
                  <a 
                    href={`/users/${user.user_id}`} 
                    className="w-full text-center py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-neutral-700"
                  >
                    View Profile
                  </a>
                  <a 
                    href={`/users/${user.user_id}/edit`} 
                    className="w-full text-center py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-neutral-700 border-l border-gray-200 dark:border-gray-700"
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}