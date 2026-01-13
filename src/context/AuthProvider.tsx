// frontend/src/context/AuthProvider.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AuthContext, User } from './AuthCore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Estado para evitar renders innecesarios

    // Configuración de Axios
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:3000', // Tu puerto de NestJS
        });

        instance.interceptors.request.use((config) => {
            const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (storedToken) {
                config.headers.Authorization = `Bearer ${storedToken}`;
            }
            return config;
        });

        return instance;
    }, []);

    // EFECTO CORREGIDO: Carga inicial desde localStorage
    useEffect(() => {
        const initializeAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    const userData: User = JSON.parse(storedUser);

                    // Actualizamos los estados
                    setToken(storedToken);
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (e) {
                    console.error("Error al parsear el usuario del localStorage", e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false); // Finaliza la carga inicial
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, api }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
