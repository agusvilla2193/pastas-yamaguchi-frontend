'use client';

import { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import axios, { AxiosInstance } from 'axios';

/**
 * CONFIGURACIÓN DE LA API PARA PRODUCCIÓN
 * Se exporta la instancia con tipado estricto de AxiosInstance.
 */
export const apiInstance: AxiosInstance = axios.create({
    // Prioriza la variable de entorno para el despliegue final
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    // Permite el intercambio de cookies de sesión (JWT) en producción
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Creamos el contexto con el tipo definido en tus interfaces, sin usar 'any'
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook personalizado para acceder al estado de autenticación.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
