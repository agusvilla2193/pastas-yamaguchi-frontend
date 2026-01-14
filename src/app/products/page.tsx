'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthCore';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}

export default function ProductsPage() {
    const { api, user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);


    const isLinkAdmin = user?.role === 'admin';

    useEffect(() => {

    }, [api]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error al traer productos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [api]);

    if (loading) return <div className="text-center mt-10">Cargando...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Nuestras Pastas</h1>

                {/* BOTÓN DE ALTA: Solo visible para admins */}
                {isLinkAdmin && (
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                        + Nueva Pasta
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-xl font-bold">{p.name}</h3>
                        <p className="text-gray-600 mt-2 text-sm">{p.description}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-2xl font-bold text-indigo-600">${p.price}</span>

                            <div className="flex space-x-2">
                                {/* BOTONES DE GESTIÓN: Solo visibles para admins */}
                                {isLinkAdmin ? (
                                    <>
                                        <button className="text-blue-600 hover:underline text-sm font-medium">Editar</button>
                                        <button className="text-red-600 hover:underline text-sm font-medium">Borrar</button>
                                    </>
                                ) : (
                                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm">Ver</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
