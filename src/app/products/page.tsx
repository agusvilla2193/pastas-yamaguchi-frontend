'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthCore'; // Mantenemos el hook por si necesitas otras funciones
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import ProductsFilters from '@/app/admin/products/components/ProductsFilters';

export default function PublicProductsPage() {
    const { loading } = useAuth();
    const { products, loading: productsLoading } = useProducts();

    const [filter, setFilter] = useState('Todas');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = products.filter(
        (p) =>
            (filter === 'Todas' || p.category === filter) &&
            p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Combinamos los estados de carga para una mejor UX
    if (loading || productsLoading)
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white italic">
                Preparando el menú del Dojo...
            </div>
        );

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-20 pt-10">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-black italic tracking-tighter text-red-600 uppercase">
                    Nuestras Pastas
                </h1>
                <p className="text-neutral-400 mt-2">Tradición artesanal en cada bocado</p>
            </header>

            <main className="max-w-6xl mx-auto px-6">
                <ProductsFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filter={filter}
                    setFilter={setFilter}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {filtered.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            isAdmin={false}
                        // El ProductCard ya sabe si el usuario está logueado 
                        // porque usa useAuth() internamente.
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
