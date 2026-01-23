'use client';

import React, { useState, useEffect } from 'react';
import { AuthContext, User } from './AuthCore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter(); // Inicializamos el router

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
                    console.error("Error al parsear el usuario del localStorage", e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        // 1. Limpiamos el almacenamiento local
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 2. Limpiamos el estado global
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        // 3. Redirigimos al Home (Página Principal)
        router.push('/');
    };

    // Evitamos parpadeos de UI mientras se carga la sesión del localStorage
    if (loading) {
        return null; // O un spinner de carga con estética japonesa
    }

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, api }}>
            {children}
        </AuthContext.Provider>
    );
};
