'use client'; // ¡IMPORTANTE! Es un componente cliente por el uso de hooks y localStorage

import { useState, useEffect, type ReactNode, useMemo, useCallback } from 'react';
import axios, { type AxiosInstance } from 'axios';
import { AuthContext, type User } from './AuthCore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const baseURL = 'http://localhost:3000'; // URL de tu NestJS Backend

    // 1. Instancia de Axios (API)
    const api: AxiosInstance = useMemo(() => {
        return axios.create({ baseURL });
    }, [baseURL]);

    // 2. Lógica de Login (estable, con useCallback)
    const login = useCallback((newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('jwtToken', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
    }, []);

    // 3. Lógica de Logout (estable, con useCallback)
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    }, []);

    // 4. Cargar sesión al iniciar la aplicación (useEffect)
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const userData: User = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(userData);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Error al parsear datos de usuario:", e);
                logout();
            }
        }
    }, [logout]);

    // 5. Configurar y Limpiar el Interceptor de Axios (CLAVE: adjunta el token)
    useEffect(() => {
        let interceptorId: number | null = null;

        if (token) {
            interceptorId = api.interceptors.request.use(
                (config) => {
                    config.headers.Authorization = `Bearer ${token}`;
                    return config;
                }
            );
        }

        return () => {
            if (interceptorId !== null) {
                api.interceptors.request.eject(interceptorId);
            }
        };
    }, [token, api]);

    // 6. Valor del contexto
    const contextValue = useMemo(() => ({
        isAuthenticated,
        user,
        login,
        logout,
        api,
    }), [isAuthenticated, user, api, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
