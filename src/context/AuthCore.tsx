'use client';

import { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import axios, { AxiosInstance } from 'axios';

export const apiInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * INTERCEPTOR DE AUTORIZACIÓN
 * Agrega el token JWT a todas las peticiones salientes
 */
apiInstance.interceptors.request.use((config) => {
    // Buscamos el token (ajustá el nombre 'token' si usas otro en tu login)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
