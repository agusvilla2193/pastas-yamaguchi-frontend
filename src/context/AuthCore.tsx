'use client';

import { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import axios, { AxiosInstance } from 'axios';

/**
 * INSTANCIA DE API
 * withCredentials: true es la clave para que el navegador mande la cookie
 * de Render a Vercel automáticamente.
 */
export const apiInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Al usar cookies, ya no necesitamos interceptores que busquen en localStorage.
// El navegador adjunta la cookie 'access_token' en cada petición a la baseURL automáticamente.

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
