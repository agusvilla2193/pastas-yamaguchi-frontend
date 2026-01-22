import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
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
