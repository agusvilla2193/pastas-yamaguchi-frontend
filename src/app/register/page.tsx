'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthCore';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { api, login } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);
            // El backend devuelve { access_token, user }
            login(response.data.access_token, response.data.user);
            router.push('/products');
        } catch (error) {
            alert('Error al registrarse. Posiblemente el email ya existe.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text" placeholder="Nombre" required
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <input
                    type="text" placeholder="Apellido" required
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                <input
                    type="email" placeholder="Email" required
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="password" placeholder="Contraseña" required
                    className="w-full p-2 border rounded"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                    Registrarse
                </button>
            </form>
        </div>
    );
}
