
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);
    const register = async (userData) => {
        const newUser = await authService.register(userData);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };
    const login = async (userData) => {
        const loggedInUser = await authService.login(userData);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
    };
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };
    const value = {
        user,
        isLoading,
        register,
        login,
        logout,
    };
    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};