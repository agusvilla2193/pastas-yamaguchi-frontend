import { createContext, useContext } from 'react';
import { AxiosInstance } from 'axios';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

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
