'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface ProductFormData {
    name: string;
    description: string;
    category: string;
    price: string | number;
    stock: string | number;
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
        category: initialData?.category || 'Simples',
        price: initialData?.price || 0,
        stock: initialData?.stock || 0,
        image: initialData?.image || '',
    });

    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit(formData);
        setIsSubmitting(false);
    };

    // Estilo común para los inputs oscuros
    const inputStyles = "w-full bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 text-white placeholder:text-neutral-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all";
    const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1 mb-2 block";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* NOMBRE */}
            <div>
                <label className={labelStyles}>Nombre de la Pasta</label>
                <input
                    type="text"
                    required
                    className={inputStyles}
                    placeholder="Ej: Sorrentinos de Jamón y Queso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            {/* CATEGORÍA */}
            <div>
                <label className={labelStyles}>Categoría</label>
                <select
                    required
                    className={`${inputStyles} cursor-pointer appearance-none`}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                    <option value="Simples">Simples</option>
                    <option value="Rellenas">Rellenas</option>
                    <option value="Salsas">Salsas</option>
                    <option value="Promos">Promos</option>
                </select>
            </div>

            {/* DESCRIPCIÓN */}
            <div>
                <label className={labelStyles}>Descripción</label>
                <textarea
                    required
                    rows={3}
                    className={inputStyles}
                    placeholder="Describe los ingredientes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            {/* PRECIO Y STOCK EN GRILLA */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className={labelStyles}>Precio ($)</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={formData.price.toString()}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.,]/g, '');
                            setFormData({ ...formData, price: val });
                        }}
                        className={inputStyles}
                        placeholder="0.00"
                    />
                </div>

                <div className="flex flex-col">
                    <label className={labelStyles}>Stock</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={formData.stock.toString()}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setFormData({ ...formData, stock: val });
                        }}
                        className={inputStyles}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* IMAGEN Y CLOUDINARY */}
            <div>
                <label className={labelStyles}>Imagen del Producto</label>
                <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 rounded-2xl p-6 bg-neutral-900/30 hover:border-red-600/50 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest">
                        {uploading ? '⏳ Subiendo...' : 'Click para subir foto'}
                    </label>

                    {formData.image && (
                        <div className="mt-4 relative w-32 h-32">
                            <Image
                                src={formData.image}
                                alt="Preview"
                                fill
                                className="object-cover rounded-xl border border-neutral-700 shadow-xl"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* BOTÓN FINAL */}
            <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-900/40 disabled:opacity-50 uppercase tracking-widest text-xs active:scale-[0.98]"
            >
                {isSubmitting ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
            </button>
        </form>
    );
}
