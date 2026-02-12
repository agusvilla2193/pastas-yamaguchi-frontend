import axios from 'axios';

/**
 * Instancia de Axios configurada para comunicarse con el Backend (NestJS).
 */
const api = axios.create({
    // Se conecta al puerto 3000 del backend
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores globales o configuraciones de último minuto
api.interceptors.request.use(
    (config) => {
        // Si en el futuro necesitas añadir algo al vuelo, hazlo aquí.
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    },
);

export default api;
