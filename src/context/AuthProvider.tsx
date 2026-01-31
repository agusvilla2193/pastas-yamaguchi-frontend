'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthCore';
import api from '@/lib/api';
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
            const response = await api.get<User>('/auth/me');
            setUser(response.data);
        } catch {
            // Eliminamos 'error' porque no se usaba, cumpliendo con @typescript-eslint/no-unused-vars
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
        api // api se mantiene aquí para que esté disponible en el contexto
    }), [user, loading, isAuthenticated, login, logout]);
    // Quitamos 'api' de aquí arriba para cumplir con react-hooks/exhaustive-deps

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
