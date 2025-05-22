// app/context/authProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCookie, setCookie } from '../../utils/cookies'; 

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// 1. Create the context with null default (not hard-coded token)
export const AuthContext = createContext<AuthContextType>({
  token: null, // Should be null, not a hard-coded JWT
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

// 2. Create a hook to use the context
export const useAuth = () => useContext(AuthContext);

// 3. AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize token from cookie on mount
    const initializeAuth = async () => {
      try {
        const savedToken = getCookie('auth-token');
        console.log('Saved token from cookie:', savedToken); // Debug log
        
        if (savedToken && savedToken.trim() !== '') {
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Error reading auth cookie:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      const jwt = data.access_token; // Changed from data.token to data.access_token
      
      console.log('Login successful, received token:', jwt); // Debug log
      console.log('Full response data:', data); // Debug log
      
      if (!jwt) {
        throw new Error('No token received from server');
      }

      setToken(jwt);
      setCookie('auth-token', jwt, { maxAge: 60 * 60 * 24 * 7 });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logging out, clearing token'); // Debug log
    setToken(null);
    setCookie('auth-token', '', { maxAge: 0 });
  };

  const auth: AuthContextType = {
    token,
    login,
    logout,
    isAuthenticated: !!token && token.trim() !== '',
  };

  // Show loading state while initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};