'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import ProductsHeader from './components/ProductsHeader';
import ProductsFilters from './components/ProductsFilters';
import ProductModal from './components/ProductModal';

export default function ProductsPage() {
    const { user } = useAuth();
    const {
        products, loading, modalState,
        openCreate, openEdit, closeModal,
        handleSave, handleDelete
    } = useProducts();

    const [filter, setFilter] = useState('Todas');
    const [searchQuery, setSearchQuery] = useState('');

    const isAdmin = user?.role === 'admin';

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
            <ProductsHeader isAdmin={isAdmin} onCreateClick={openCreate} />

            <main className="max-w-6xl mx-auto px-6">
                <ProductsFilters
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                    filter={filter} setFilter={setFilter}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(p => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            isAdmin={isAdmin}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </main>

            <ProductModal
                state={modalState}
                onClose={closeModal}
                onSubmit={handleSave}
            />
        </div>
    );
}
