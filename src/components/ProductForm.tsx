'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { uploadToCloudinary } from '@/lib/upload';
import { Product, ProductFormData } from '@/types/product';
import { toast } from 'sonner';

interface ProductFormProps {
    onSubmit: (data: ProductFormData) => void;
    initialData?: Product;
}

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 ml-1 mb-2 block">
        {children}
    </label>
);

const inputStyles = "w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-sm text-white placeholder:text-neutral-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-300";

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        category: initialData?.category || 'Simples',
        price: initialData?.price || '',
        stock: initialData?.stock || '',
        image: initialData?.image || '',
    });

    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, image: url }));
            toast.success('Imagen lista para la carta');
        } catch {
            // Eliminamos 'error' para que no tire subrayado amarillo
            toast.error("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
                <Label>Nombre de la Pasta</Label>
                <input
                    type="text"
                    required
                    className={inputStyles}
                    placeholder="Ej: Raviolones de Cordero"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div>
                <Label>Categoría</Label>
                <div className="relative">
                    <select
                        required
                        className={`${inputStyles} cursor-pointer appearance-none pr-10`}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {['Simples', 'Rellenas', 'Salsas', 'Promos'].map(cat => (
                            <option key={cat} value={cat} className="bg-neutral-950">{cat}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            <div>
                <Label>Descripción & Alma</Label>
                <textarea
                    required
                    rows={3}
                    className={`${inputStyles} resize-none`}
                    placeholder="Describe los ingredientes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Precio ($)</Label>
                    <input
                        type="text"
                        inputMode="decimal"
                        className={inputStyles}
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^0-9.,]/g, '') })}
                    />
                </div>
                <div>
                    <Label>Stock</Label>
                    <input
                        type="text"
                        inputMode="numeric"
                        className={inputStyles}
                        placeholder="10"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                </div>
            </div>

            <div>
                <Label>Imagen Representativa</Label>
                <div className={`mt-2 relative overflow-hidden border-2 border-dashed rounded-3xl transition-all duration-500 ${formData.image ? 'border-red-600/30 bg-neutral-900/10' : 'border-neutral-800 bg-neutral-900/30 hover:border-neutral-600'}`}>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-upload" />

                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center p-8 cursor-pointer min-h-[160px]">
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Subiendo...</span>
                            </div>
                        ) : formData.image ? (
                            <div className="relative w-full aspect-video md:w-48 md:h-28">
                                <Image src={formData.image} alt="Preview" fill className="object-cover rounded-xl border border-neutral-800 shadow-2xl" />
                                <div className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>
                        ) : (
                            <>
                                <svg className="w-8 h-8 text-neutral-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300 transition-colors">Click para subir foto</span>
                            </>
                        )}
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="w-full relative overflow-hidden group bg-red-600 disabled:bg-neutral-800 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-[0.98]"
            >
                <span className="relative z-10 text-[10px] uppercase tracking-[0.3em]">
                    {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Pasta' : 'Añadir a la Carta')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
        </form>
    );
}
