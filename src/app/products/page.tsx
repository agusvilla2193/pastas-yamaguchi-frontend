'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthCore';
import { ProductCard } from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import { Product, ProductFormData } from '@/types/product';
import { toast } from 'sonner';
import ProductsHeader from './components/ProductsHeader';
import ProductsFilters from './components/ProductsFilters';

export default function ProductsPage() {
    const { api, user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [filter, setFilter] = useState('Todas');
    const [searchQuery, setSearchQuery] = useState('');

    const isLinkAdmin = user?.role === 'admin';

    const fetchProducts = useCallback(async () => {
        try {
            const response = await api.get<Product[]>('/products');
            setProducts(response.data);
        } catch {
            toast.error('No se pudieron cargar las pastas');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleCreate = async (formData: ProductFormData) => {
        try {
            const finalData = {
                ...formData,
                price: Number(formData.price.toString().replace(',', '.')),
                stock: Number(formData.stock)
            };
            const response = await api.post<Product>('/products', finalData);
            setProducts(prev => [...prev, response.data]);
            toast.success('¡Nueva pasta creada!');
            setIsCreateModalOpen(false);
        } catch {
            toast.error('Error al crear el producto');
        }
    };

    const handleUpdate = async (formData: ProductFormData) => {
        if (!selectedProduct) return;
        try {
            const finalData = {
                ...formData,
                price: Number(formData.price.toString().replace(',', '.')),
                stock: Number(formData.stock)
            };
            await api.patch(`/products/${selectedProduct.id}`, finalData);

            setProducts(prev => prev.map(p =>
                p.id === selectedProduct.id ? { ...p, ...finalData, id: p.id } : p
            ));

            setIsEditModalOpen(false);
            setSelectedProduct(null);
            toast.success('¡Pasta actualizada!');
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async (id: number) => {
        toast('¿Eliminar esta pasta?', {
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await api.delete(`/products/${id}`);
                        setProducts(prev => prev.filter(p => p.id !== id));
                        toast.success('Producto eliminado');
                    } catch {
                        toast.error('Error al eliminar');
                    }
                }
            }
        });
    };

    const filtered = products.filter(p =>
        (filter === 'Todas' || p.category === filter) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white italic">
            Cargando el Dojo...
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-20">
            <ProductsHeader
                isAdmin={isLinkAdmin}
                onCreateClick={() => setIsCreateModalOpen(true)}
            />

            <main className="max-w-6xl mx-auto px-6">
                <ProductsFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filter={filter}
                    setFilter={setFilter}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(p => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            isAdmin={isLinkAdmin}
                            onEdit={(prod) => {
                                setSelectedProduct(prod);
                                setIsEditModalOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </main>

            {/* Modal Reutilizable */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
                    <div className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl rounded-[3rem] overflow-hidden">
                        <div className="p-8 border-b border-neutral-900 flex justify-between items-center">
                            <h2 className="text-xl font-black italic uppercase">
                                {isCreateModalOpen ? 'Nueva Pasta' : `Editar: ${selectedProduct?.name}`}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setIsEditModalOpen(false);
                                    setSelectedProduct(null);
                                }}
                                className="text-2xl text-neutral-500 hover:text-white"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <ProductForm
                                onSubmit={isCreateModalOpen ? handleCreate : handleUpdate}
                                initialData={isEditModalOpen ? (selectedProduct ?? undefined) : undefined}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
