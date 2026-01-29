import axios from 'axios';

const api = axios.create({
    // Prioriza la variable de entorno, si no existe, usa el puerto 3000
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            config.headers.Authorization = `Bearer ${storedToken}`;
        }
    }
    return config;
});

export default api;
