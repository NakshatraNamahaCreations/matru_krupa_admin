import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mk_admin_token');
    const saved = localStorage.getItem('mk_admin_user');
    if (token && saved) {
      try {
        setStaff(JSON.parse(saved));
      } catch (_) {
        localStorage.removeItem('mk_admin_token');
        localStorage.removeItem('mk_admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/staff/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('mk_admin_token', data.token);
    localStorage.setItem('mk_admin_user', JSON.stringify(data));
    setStaff(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mk_admin_token');
    localStorage.removeItem('mk_admin_user');
    setStaff(null);
  };

  return (
    <AuthContext.Provider value={{ staff, loading, isLoggedIn: !!staff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
