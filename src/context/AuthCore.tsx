import React, { useContext } from 'react';
import { type AxiosInstance } from 'axios';

// 1. Interfaz para tipar el usuario
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    // Puedo añadir más campos si los necesito
}

// 2. Interfaz para tipar el Contexto de Autenticación
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    api: AxiosInstance; // La instancia de Axios configurada con el token
}

// 3. Crear el Contexto
export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// 4. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
