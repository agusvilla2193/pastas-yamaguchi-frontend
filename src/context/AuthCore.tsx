'use client';

import { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Solo creamos el contexto vacío
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// El Hook para usarlo en toda la app
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
