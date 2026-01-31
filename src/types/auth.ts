import { AxiosInstance } from 'axios';

export interface User {
    id: number;
    email: string;
    role: string;
    firstName?: string;
    first_name?: string;
    lastName?: string;
    last_name?: string;
    name?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    api: AxiosInstance;
}
