import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Connect to the socket server
const socket = io('http://localhost:5000'); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // --- ⭐️ FIX 1: Rename state variable ---
  const [authLoading, setAuthLoading] = useState(true); 
  
  const navigate = useNavigate();

  const API = axios.create({ baseURL: 'http://localhost:5000' });

  API.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // --- Auth Functions ---

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const login = async (email, password) => {
    // ... (login function is unchanged)
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
    // ... (register function is unchanged)
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
  
  const toggleFollow = async (sellerId) => {
    // ... (toggleFollow function is unchanged)
    if (!user) return; 

    try {
      await API.put(`/api/users/${sellerId}/follow`);
      setUser(currentUser => {
        const currentFollowing = currentUser.following || []; 
        const isFollowing = currentFollowing.includes(sellerId);
        let newFollowingList;
        if (isFollowing) {
          newFollowingList = currentFollowing.filter(id => id !== sellerId);
        } else {
          newFollowingList = [...currentFollowing, sellerId];
        }
        return { ...currentUser, following: newFollowingList };
      });
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      alert('Could not update follow status.');
    }
  };

  // --- useEffect Hooks ---

  useEffect(() => {
    const getProfile = async () => {
      if (token) {
        try {
          const { data } = await API.get('/api/users/profile');
          setUser(data);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          logout();
        }
      }
      setAuthLoading(false); // <-- Use the renamed function
    };
    getProfile();
  }, [token]);

  useEffect(() => {
    // ... (socket.io logic is unchanged) ...
    if (user) {
      socket.emit('join_room', user._id);
      socket.on('new_notification', (message) => {
        toast.success(message);
      });
      return () => {
        socket.off('new_notification');
      };
    }
  }, [user]);

  // --- ⭐️ FIX 2: Update the 'value' prop ⭐️ ---
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        register, 
        logout, 
        loading: authLoading, // <-- Pass authLoading as 'loading'
        API,
        toggleFollow
      }}
    >
      {!authLoading && children} {/* <-- Check authLoading here */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};