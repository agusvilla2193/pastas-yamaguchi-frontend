'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
// Corregido: Usamos el alias @ para evitar errores de rutas relativas
import ProductsFilters from '@/app/admin/products/components/ProductsFilters';
import { toast } from 'sonner';

export default function PublicProductsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { products, loading } = useProducts();

    const [filter, setFilter] = useState('Todas');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddToCart = () => {
        if (!user) {
            toast.info('¡Inicia sesión para armar tu pedido!', {
                description: 'Necesitas una cuenta para añadir productos al carrito.',
                action: {
                    label: 'Ir al Login',
                    onClick: () => router.push('/login')
                },
            });
            return;
        }

        toast.success('¡Pasta añadida al carrito!');
    };

    const filtered = products.filter(p =>
        (filter === 'Todas' || p.category === filter) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
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
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                    filter={filter} setFilter={setFilter}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {filtered.map(p => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            isAdmin={false}
                            // Corregido: Agregamos funciones vacías para que TS no se queje
                            onEdit={() => { }}
                            onDelete={() => { }}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
