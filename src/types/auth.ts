import { AxiosInstance } from 'axios';

export interface User {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    zipCode?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    api: AxiosInstance;
}
