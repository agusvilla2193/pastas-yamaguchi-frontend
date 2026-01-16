'use client';

import React, { useState } from 'react';
import Image from 'next/image'; // 1. Importamos el componente optimizado

// Definimos la interfaz para los datos que maneja el formulario
export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
}

interface ProductFormProps {
    onSubmit: (data: ProductFormData) => void;
    initialData?: Partial<ProductFormData>;
}

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        stock: initialData?.stock || 0,
        image: initialData?.image || '',
    });

    const [uploading, setUploading] = useState(false);

    // Lógica para subir la imagen a Cloudinary
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
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ej: Sorrentinos de Jamón y Queso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                <textarea
                    required
                    rows={3}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Describe los ingredientes o el tipo de pasta..."
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
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Stock Inicial</label>
                    <input
                        type="number"
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />

                {uploading && (
                    <div className="mt-2 flex items-center text-blue-600 text-sm">
                        <span className="animate-pulse">⏳ Subiendo archivo...</span>
                    </div>
                )}

                {formData.image && (
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Vista Previa:</p>
                        { }
                        <Image
                            src={formData.image}
                            alt="Preview"
                            width={160}
                            height={160}
                            className="object-cover rounded-lg border-2 border-indigo-100 shadow-sm"
                        />
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all ${uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                    }`}
            >
                {uploading ? 'Procesando...' : 'Guardar Producto'}
            </button>
        </form>
    );
}
