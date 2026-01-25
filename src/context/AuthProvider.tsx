'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import { AuthContext } from './AuthCore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useLocalStorage<string | null>('token', null);
    const [user, setUser] = useLocalStorage<User | null>('user', null);
    const router = useRouter();


    const isAuthenticated = !!token;

    useEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return () => api.interceptors.request.eject(interceptor);
    }, [token]);

    const login = useCallback((newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
    }, [setToken, setUser]);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        router.push('/');
    }, [router, setToken, setUser]);

    const contextValue = useMemo(() => ({
        token,
        user,
        loading: false, // Forzamos loading a false ya que useLocalStorage es síncrono en el cliente
        isAuthenticated,
        login,
        logout,
        api
    }), [token, user, isAuthenticated, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
