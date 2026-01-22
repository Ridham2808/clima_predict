'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPusherClient } from '@/utils/pusher';
import { apiService } from '@/services/apiService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }

        // Check if user is logged in on mount
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user');
        const expiry = localStorage.getItem('auth_expiry');

        if (token && userData && expiry) {
            const now = Date.now();
            if (now < parseInt(expiry)) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    fetchNotificationCount();
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    logout();
                }
            } else {
                logout();
            }
        }
        setLoading(false);
    }, []);

    // Real-time notification listener
    useEffect(() => {
        if (!user) return;

        const pusher = getPusherClient();
        if (pusher) {
            const channel = pusher.subscribe(`user-${user.id}`);
            channel.bind('new-notification', (data) => {
                console.log('Real-time notification received:', data);
                setUnreadNotifications(prev => prev + 1);
            });

            return () => {
                pusher.unsubscribe(`user-${user.id}`);
            };
        }
    }, [user]);

    const fetchNotificationCount = async () => {
        const res = await apiService.getNotifications(true);
        if (res.success) {
            setUnreadNotifications(res.data.unreadCount || 0);
        }
    };

    const login = (userData, token) => {
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const expiry = Date.now() + SEVEN_DAYS_MS;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_expiry', expiry.toString());
        setUser(userData);
        fetchNotificationCount();
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_expiry');
        setUser(null);
        setUnreadNotifications(0);
        router.push('/auth/login');
    };

    const updateUser = (updatedData) => {
        const newUserData = { ...user, ...updatedData };
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            updateUser,
            unreadNotifications,
            refreshNotifications: fetchNotificationCount
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
