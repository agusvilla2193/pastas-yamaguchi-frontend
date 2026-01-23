'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthContext, User } from './AuthCore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // 1. Inicialización de la sesión desde el almacenamiento local
    useEffect(() => {
        const initializeAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    const userData: User = JSON.parse(storedUser);
                    setToken(storedToken);
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (e) {
                    console.error("Error al recuperar sesión del localStorage:", e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    // 2. INTERCEPTOR: Pega el Token a cada petición de Axios (Vital para /orders)
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use((config) => {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                config.headers.Authorization = `Bearer ${currentToken}`;
            }
            return config;
        });

        // Limpieza del interceptor cuando el componente se desmonte
        return () => {
            api.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    // 3. Función de Login memoizada
    const login = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
    }, []);

    // 4. Función de Logout memoizada
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        router.push('/');
    }, [router]);

    // 5. El objeto de valor del contexto con todas las dependencias para el compilador
    const contextValue = useMemo(() => ({
        token,
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        api
    }), [token, user, loading, isAuthenticated, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
