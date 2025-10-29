import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set the base URL for all API requests
  const API = axios.create({ baseURL: 'http://localhost:5000' });

  // Add the token to all API requests
  API.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Check if user is logged in when app loads
  useEffect(() => {
    const getProfile = async () => {
      if (token) {
        try {
          const { data } = await API.get('/api/users/profile');
          setUser(data);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          logout(); // Bad token
        }
      }
      setLoading(false);
    };
    getProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/api/users/login', { email, password });
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      throw new Error(error.response.data.message || 'Login Failed');
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await API.post('/api/users/register', { name, email, password, role });
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      throw new Error(error.response.data.message || 'Registration Failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};