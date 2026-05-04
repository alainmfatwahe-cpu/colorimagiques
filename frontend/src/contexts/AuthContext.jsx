// frontend/src/contexts/AuthContext.jsx
// Contexte d'authentification admin — JWT simple, zéro Base44
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/api/basecolorimag';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      authApi.me()
        .then((data) => {
          setAdmin(data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
          setIsAuthenticated(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('admin_token', data.token);
    setAdmin(data.admin);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
