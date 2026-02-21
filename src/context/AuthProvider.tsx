'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { AuthContext, apiInstance as api } from './AuthCore'; // Importamos la instancia configurada
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useLocalStorage<User | null>('user', null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const isAuthenticated = !!user;

    const checkAuth = useCallback(async () => {
        try {
            // Usamos la instancia 'api' que viene de AuthCore
            const response = await api.get<User>('/auth/me');
            setUser(response.data);
        } catch {
            // Si falla el /me (ej: cookie expirada), limpiamos el estado
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [setUser]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback((userData: User) => {
        if (!userData) return;
        setUser(userData);
    }, [setUser]);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        } finally {
            setUser(null);
            router.push('/');
        }
    }, [router, setUser]);

    const contextValue = useMemo(() => ({
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        api // Esta es la apiInstance configurada con withCredentials
    }), [user, loading, isAuthenticated, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {/* Solo mostramos la app cuando terminó la carga inicial de auth */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
