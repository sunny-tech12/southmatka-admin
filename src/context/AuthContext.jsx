// Location: admin-panel/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, handleAPIError } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('adminToken');
      const savedUser = localStorage.getItem('adminUser');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (phone, password) => {
    try {
      const response = await authAPI.login(phone, password);
      
      if (response.data.success) {
        const { user, token } = response.data.data;

        // Check if user is admin
        if (user.role !== 'admin') {
          throw new Error('Access denied. Admin only.');
        }

        // Save to state and localStorage
        setUser(user);
        setToken(token);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));

        return { success: true };
      }
    } catch (error) {
      const message = handleAPIError(error);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  // Update user data
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('adminUser', JSON.stringify(newUserData));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};