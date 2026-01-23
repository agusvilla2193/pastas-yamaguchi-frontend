import { createContext, useContext } from 'react';
import { AxiosInstance } from 'axios';

// Defino la estructura del usuario
export interface User {
    id: number;
    firstName?: string; // opcional
    first_name?: string; // agregado para compatibilidad con DB
    lastName?: string;
    last_name?: string;
    name?: string;
    email: string;
    role: string;
}

// Defino lo que el Contexto va a ofrecer a toda la app
export interface AuthContextType {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    api: AxiosInstance;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
