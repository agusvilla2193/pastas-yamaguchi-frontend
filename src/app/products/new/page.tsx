'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthCore';
import ProductForm, { ProductFormData } from '../../../components/ProductForm';

export default function NewProductPage() {
    const { api, user } = useAuth();
    const router = useRouter();

    // 1. Verificación de Seguridad: Solo administradores pueden acceder
    // Si el usuario no es admin o no está logueado, mostramos denegado
    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h1 className="text-3xl font-bold text-red-600">Acceso Restringido</h1>
                <p className="text-gray-600 mt-2">No tienes permisos para gestionar el inventario.</p>
                <button
                    onClick={() => router.push('/products')}
                    className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    // 2. Función para enviar los datos al Backend
    const handleCreateProduct = async (formData: ProductFormData) => {
        try {
            await api.post('/products', formData);
            alert('¡Producto creado exitosamente!');
            router.push('/products');
            router.refresh();

        } catch (error: unknown) {
            console.error('Error al guardar en el servidor:', error);

            const errorData = error as { response?: { data?: { message?: string } } };
            const message = errorData.response?.data?.message || 'Error al conectar con el servidor';

            alert(`Error: ${message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Cargar Nueva Pasta
                    </h1>
                    <p className="text-gray-500 mt-2">
                        El producto aparecerá inmediatamente en la tienda tras ser guardado.
                    </p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="mt-4 md:mt-0 text-gray-500 hover:text-indigo-600 transition font-medium flex items-center"
                >
                    <span className="mr-2">←</span> Cancelar
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Pasamos la función handleCreate al componente del formulario */}
                <ProductForm onSubmit={handleCreateProduct} />
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
                Asegúrate de que la imagen sea clara y el stock refleje la realidad del local.
            </p>
        </div>
    );
}
