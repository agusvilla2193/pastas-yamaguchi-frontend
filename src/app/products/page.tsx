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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [filter, setFilter] = useState('Todas');

    // Lógica de filtrado
    const filteredProducts = products.filter(p => {
        if (filter === 'Todas') return true;
        return p.name.toLowerCase().includes(filter.toLowerCase());
    });

    const isLinkAdmin = user?.role === 'admin';

    const handleOpenEditModal = (product: Product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleUpdate = async (formData: ProductFormData) => {
        if (!selectedProduct) return;
        try {
            const finalData = {
                ...formData,
                price: Number(formData.price.toString().replace(',', '.')),
                stock: Number(formData.stock),
            };
            await api.patch(`/products/${selectedProduct.id}`, finalData);
            setProducts((prev) =>
                prev.map((p) => (p.id === selectedProduct.id ? { ...p, ...finalData } : p))
            );
            handleCloseModal();
        } catch (error: any) {
            console.error("Error al actualizar:", error.response?.data);
            alert('No se pudo actualizar el producto');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [api]);

    if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-bold tracking-widest uppercase">Cargando Yamaguchi...</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-red-600/30">

            {/* --- HEADER FIJO --- */}
            <header className="sticky top-0 z-30 w-full bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
                <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic text-white">
                            YAMAGUCHI <span className="text-red-600 not-italic">PASTAS</span>
                        </h1>
                        <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] font-bold">Tradición Japonesa & Alma Italiana</p>
                    </div>

                    {isLinkAdmin && (
                        <Link href="/products/new">
                            <button className="bg-white text-black px-5 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 font-bold text-xs shadow-xl uppercase tracking-tight">
                                + Nueva Pasta
                            </button>
                        </Link>
                    )}
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 mt-8">

                {/* --- SECCIÓN DE FILTROS --- */}
                <div className="mb-10 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {['Todas', 'Simples', 'Rellenas', 'Salsas', 'Promos'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${filter === cat
                                    ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* --- GRID DE PRODUCTOS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                            <div key={p.id} className="group bg-neutral-900/50 rounded-[2rem] border border-neutral-800/50 overflow-hidden flex flex-col hover:border-red-600/50 transition-all duration-500 shadow-xl backdrop-blur-sm">

                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={p.image || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                        alt={p.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60" />
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors mb-1">{p.name}</h3>
                                    <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed mb-4">{p.description}</p>

                                    <div className="mt-auto flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-red-600 text-[10px] uppercase font-black tracking-widest mb-0.5">Precio</span>
                                            <span className="text-xl font-black text-white">${p.price}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            {isLinkAdmin ? (
                                                <>
                                                    <button onClick={() => handleOpenEditModal(p)} className="p-2 rounded-xl bg-neutral-800 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl bg-neutral-800 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">Comprar</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-neutral-500 italic">No hay productos en la categoría <span className="text-red-500 font-bold">{filter}</span></p>
                        </div>
                    )}
                </div>
            </main>

            {/* --- MODAL DE EDICIÓN --- */}
            {isEditModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-8 border-b border-neutral-800 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Editar: <span className="text-red-500">{selectedProduct.name}</span></h2>
                            <button onClick={handleCloseModal} className="text-neutral-500 hover:text-white transition-colors text-3xl">&times;</button>
                        </div>
                        <div className="p-8 text-black"> {/* Agregado text-black aquí para que el formulario se vea bien si usa fondo blanco */}
                            <ProductForm onSubmit={handleUpdate} initialData={selectedProduct} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
