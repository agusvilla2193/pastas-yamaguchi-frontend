import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosInstance } from 'axios';
import api from '@/lib/api';


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
    loading: boolean;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // <--- 1. Iniciamos en TRUE

    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (savedToken && savedUser) {
                try {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                    // Aquí podrías validar el token con el backend si quisieras
                } catch (e) {
                    console.error("Error recuperando sesión", e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            // <--- 2. IMPORTANTE: Una vez que chequeamos el storage, dejamos de cargar
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    // Objeto con todo lo que compartimos
    const value: AuthContextType = {
        token,
        user,
        loading, // <--- 3. Pasamos el estado real aquí
        isAuthenticated: !!token,
        login,
        logout,
        api // Asegúrate de tener tu instancia de axios aquí
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
