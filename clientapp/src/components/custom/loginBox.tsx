// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../app/context/authProvider';
import { useRouter } from 'next/navigation'; 

const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        try {
          const success = await auth.login(email, password);
          if (!success) {
            setError('Invalid email or password');
          } else {
            router.push('/'); 
          }
        } catch {
          setError('An error occurred during login');
        } finally {
          setIsLoading(false);
        }
      };

    if (auth.isAuthenticated) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
                <div className="text-center text-green-600 font-medium">
                    You are logged in!
                </div>
                <button
                    onClick={auth.logout}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-4 transition duration-200"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10"
        >
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Login to Your Account
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                />
            </div>

            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md transition duration-200 ${isLoading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default LoginForm;
