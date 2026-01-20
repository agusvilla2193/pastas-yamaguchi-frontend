'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface ProductFormData {
    name: string;
    description: string;
    category: string; // Ya estaba en tu interfaz
    price: number;
    stock: number;
    image: string;
}

interface ProductFormProps {
    onSubmit: (data: ProductFormData) => void;
    initialData?: Partial<ProductFormData>;
}

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
    // 1. Agregamos la categoría al estado inicial
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        category: initialData?.category || 'Simples', // Default 'Simples'
        price: initialData?.price || 0,
        stock: initialData?.stock || 0,
        image: initialData?.image || '',
    });

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'pastas_preset');

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/dfvj78jdc/image/upload`,
                { method: 'POST', body: data }
            );
            const fileData = await res.json();

            if (fileData.secure_url) {
                setFormData(prev => ({ ...prev, image: fileData.secure_url }));
            }
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("Error al subir la imagen a Cloudinary");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.price <= 0) return alert("El precio debe ser mayor a 0");
        if (formData.stock < 0) return alert("El stock no puede ser negativo");
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div>
                <label className="block text-sm font-semibold text-gray-700">Nombre de la Pasta</label>
                <input
                    type="text"
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-black"
                    placeholder="Ej: Sorrentinos de Jamón y Queso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            {/* --- SELECTOR DE CATEGORÍA (Integrado con tu estado) --- */}
            <div>
                <label className="block text-sm font-semibold text-gray-700">Categoría</label>
                <select
                    required
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-black bg-white cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                    <option value="Simples">Simples</option>
                    <option value="Rellenas">Rellenas</option>
                    <option value="Salsas">Salsas</option>
                    <option value="Promos">Promos</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                <textarea
                    required
                    rows={3}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-black"
                    placeholder="Describe los ingredientes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Precio ($)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-black"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Stock Inicial</label>
                    <input
                        type="number"
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-black"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700">Imagen del Producto</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                />

                {uploading && (
                    <div className="mt-2 flex items-center text-red-600 text-sm font-bold">
                        <span className="animate-pulse">⏳ Subiendo a Cloudinary...</span>
                    </div>
                )}

                {formData.image && (
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Vista Previa:</p>
                        <Image
                            src={formData.image}
                            alt="Preview"
                            width={160}
                            height={160}
                            className="object-cover rounded-lg border-2 border-red-100 shadow-sm"
                        />
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={uploading}
                className={`w-full py-4 rounded-xl text-white font-black uppercase tracking-widest text-sm shadow-md transition-all ${uploading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 active:scale-95 shadow-red-900/20'
                    }`}
            >
                {uploading ? 'Procesando...' : 'Guardar Producto'}
            </button>
        </form>
    );
}
