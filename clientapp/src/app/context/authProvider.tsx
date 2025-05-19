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

// 1. Create the context with a default
export const AuthContext = createContext<AuthContextType>({
  token: null,
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
    const savedToken = getCookie('auth-token');
    if (savedToken) setToken(savedToken);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      const jwt = data.token;
      setToken(jwt);
      setCookie('auth-token', jwt, { maxAge: 60 * 60 * 24 * 7 });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setCookie('auth-token', '', { maxAge: 0 });
  };

  const auth: AuthContextType = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  if (loading) return <div>Loading...</div>;

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
