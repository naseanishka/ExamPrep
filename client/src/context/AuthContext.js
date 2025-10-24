import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Check if user is logged in by making a test request
            const response = await authAPI.signin({ userName: '', password: '' });
        } catch (error) {
            // If error, user is not logged in
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData) => {
        try {
            const response = await authAPI.signin(userData);
            setUser(response.data.user);
            return { 
                success: true,
                user: response.data.user  // ✅ Return user data with role
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };  

    const register = async (userData) => {
        try {
            const response = await authAPI.signup(userData);
            setUser(response.data.user);
            return { 
                success: true,
                user: response.data.user  // ✅ Return user data with role
            };
        } 
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        // Clear any stored tokens/cookies
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};