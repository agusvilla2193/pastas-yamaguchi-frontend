'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthCore';
import Link from 'next/link';
import Image from 'next/image';
import ProductForm, { ProductFormData } from '../../components/ProductForm';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string;
}

export default function ProductsPage() {
    const { api, user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS PARA EL MODAL DE EDICIÓN ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const isLinkAdmin = user?.role === 'admin';

    // Función para abrir el modal cargando el producto seleccionado
    const handleOpenEditModal = (product: Product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    // Función para cerrar el modal y limpiar
    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    // --- FUNCIÓN PARA ACTUALIZAR (SUBMIT DEL MODAL) ---
    const handleUpdate = async (formData: ProductFormData) => {
        if (!selectedProduct) return;

        try {
            await api.patch(`/products/${selectedProduct.id}`, formData);

            // Actualizamos la lista localmente
            setProducts((prev) =>
                prev.map((p) => (p.id === selectedProduct.id ? { ...p, ...formData } : p))
            );

            alert('¡Producto actualizado correctamente!');
            handleCloseModal();
        } catch (error: unknown) {
            console.error("Error al actualizar:", error);
            alert('No se pudo actualizar el producto');
        }
    };

    // --- FUNCIÓN PARA ELIMINAR ---
    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta pasta?')) return;

        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter(p => p.id !== id));
            alert('Producto eliminado correctamente');
        } catch (error: unknown) {
            console.error("Error al eliminar:", error);
            const err = error as { response?: { data?: { message?: string } } };
            alert(err.response?.data?.message || 'Error al intentar eliminar el producto');
        }
    };

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

    if (loading) return <div className="text-center mt-10 font-medium">Cargando pastas...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900">Nuestras Pastas</h1>

                {isLinkAdmin && (
                    <Link href="/products/new">
                        <button className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-all shadow-sm font-semibold">
                            + Nueva Pasta
                        </button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col">

                        <div className="relative h-56 w-full bg-gray-100">
                            <Image
                                src={p.image || 'https://via.placeholder.com/400x300?text=Pasta'}
                                alt={p.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 hover:scale-110"
                                priority={false}
                            />
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                            <p className="text-gray-500 mt-2 text-sm line-clamp-2 leading-relaxed">
                                {p.description}
                            </p>

                            <div className="mt-auto pt-6 flex justify-between items-center">
                                <span className="text-2xl font-black text-indigo-600">${p.price}</span>

                                <div className="flex space-x-3">
                                    {isLinkAdmin ? (
                                        <>
                                            <button
                                                onClick={() => handleOpenEditModal(p)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-bold uppercase tracking-wider"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-bold uppercase tracking-wider"
                                            >
                                                Borrar
                                            </button>
                                        </>
                                    ) : (
                                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md">
                                            Comprar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            {isEditModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-gray-800">Editar: {selectedProduct.name}</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-red-500 transition-colors text-3xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6">
                            <ProductForm
                                onSubmit={handleUpdate}
                                initialData={selectedProduct}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
