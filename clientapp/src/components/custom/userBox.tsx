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

type CreateUserData = {
  username: string;
  email: string;
  password: string;
  role: "admin" | "member";
};

export default function UserGrid() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    email: '',
    password: '',
    role: 'member'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch('http://127.0.0.1:8080/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      // Reset form and close modal
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'member'
      });
      setIsModalOpen(false);
      
      // Refresh the users list
      await fetchUsers();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCreateError(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'member'
    });
  };

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
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New User
        </button>
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
                  {/* <a 
                    href={`/users/${user.user_id}/edit`} 
                    className="w-full text-center py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-neutral-700 border-l border-gray-200 dark:border-gray-700"
                  >
                    Edit
                  </a> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create New User</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6">
              {createError && (
                <div className="mb-4 p-3 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">
                  {createError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`px-4 py-2 text-white rounded-lg transition duration-200 ${
                    isCreating 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}