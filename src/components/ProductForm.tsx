'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductFormData } from '@/types/product';
import { Label, Input, TextArea } from './ui/FormElements';
import { useProductForm } from '@/hooks/useProductForm';

interface ProductFormProps {
    onSubmit: (data: ProductFormData) => void;
    initialData?: Product;
}

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
    const { formData, uploading, handleInputChange, handleImageUpload } = useProductForm(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try { await onSubmit(formData); } finally { setIsSubmitting(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label>Nombre de la Pasta</Label>
                <Input
                    required
                    placeholder="Ej: Raviolones de Cordero"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                />
            </div>

            <div>
                <Label>Categoría</Label>
                <div className="relative">
                    <select
                        required
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-sm text-white appearance-none cursor-pointer outline-none focus:border-red-600"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                        {['Simples', 'Rellenas', 'Salsas', 'Promos'].map(cat => (
                            <option key={cat} value={cat} className="bg-neutral-950">{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <Label>Descripción & Alma</Label>
                <TextArea
                    required
                    rows={3}
                    placeholder="Describe los ingredientes..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Precio ($)</Label>
                    <Input
                        inputMode="decimal"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value.replace(/[^0-9.,]/g, ''))}
                    />
                </div>
                <div>
                    <Label>Stock</Label>
                    <Input
                        inputMode="numeric"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value.replace(/[^0-9]/g, ''))}
                    />
                </div>
            </div>

            {/* SECCIÓN DE IMAGEN */}
            <div>
                <Label>Imagen Representativa</Label>
                <div className={`mt-2 relative overflow-hidden border-2 border-dashed rounded-3xl transition-all ${formData.image ? 'border-red-600/30' : 'border-neutral-800'}`}>
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    />
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center p-8 cursor-pointer min-h-[160px]">
                        {uploading ? (
                            <div className="animate-spin w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full" />
                        ) : formData.image ? (
                            <div className="relative w-48 h-28">
                                <Image src={formData.image} alt="Preview" fill className="object-cover rounded-xl border border-neutral-800 shadow-2xl" />
                            </div>
                        ) : (
                            <span className="text-[10px] font-black uppercase text-neutral-500">Click para subir foto</span>
                        )}
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="w-full bg-red-600 disabled:bg-neutral-800 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-red-700 active:scale-[0.98]"
            >
                {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Pasta' : 'Añadir a la Carta')}
            </button>
        </form>
    );
}
