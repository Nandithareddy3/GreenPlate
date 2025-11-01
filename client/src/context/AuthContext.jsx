import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; // 1. Import socket.io
import toast from 'react-hot-toast';
const AuthContext = createContext();
const socket = io('http://localhost:5000');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- Moved up

  const API = axios.create({ baseURL: 'http://localhost:5000' });

  API.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // --- ⭐️ FIX: MOVED ALL FUNCTIONS UP ⭐️ ---

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

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
  
  const toggleFollow = async (sellerId) => {
    if (!user) return; 

    try {
      await API.put(`/api/users/${sellerId}/follow`);
      setUser(currentUser => {
        const currentFollowing = currentUser.following || [];
        const isFollowing = currentFollowing.includes(sellerId);
        let newFollowingList;

        if (isFollowing) {
          // Unfollow
          newFollowingList = currentFollowing.filter(id => id !== sellerId);
        } else {
          // Follow
          newFollowingList = [...currentFollowing, sellerId];
        }
        return { ...currentUser, following: newFollowingList };
      });
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      alert('Could not update follow status.');
    }
  };

  // --- End of moved functions ---


  // This useEffect can now safely call logout()
  useEffect(() => {
    const getProfile = async () => {
      if (token) {
        try {
          const { data } = await API.get('/api/users/profile');
          setUser(data);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          logout(); // This is now safe to call
        }
      }
      setLoading(false);
    };
    getProfile();
  }, [token]); // We removed 'logout' from dependency array as it's defined outside
useEffect(() => {
    if (user) {
      // Join a "room" based on the user's ID
      socket.emit('join_room', user._id);

      // Listen for the 'new_notification' event from the server
      socket.on('new_notification', (message) => {
        toast.success(message); // 5. Show the pop-up!
      });

      // Clean up the listener when the component unmounts
      return () => {
        socket.off('new_notification');
      };
    }
  }, [user]);
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        register, 
        logout, 
        loading, 
        API,
        toggleFollow
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};