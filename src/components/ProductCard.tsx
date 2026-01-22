'use client';

import Image from 'next/image';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
    isAdmin: boolean;
    onEdit: (p: Product) => void;
    onDelete: (id: number) => void;
}

export const ProductCard = ({ product, isAdmin, onEdit, onDelete }: ProductCardProps) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} agregada`, {
            description: "Se sumó a tu pedido artesanal.",
            icon: '🍜'
        });
    };

    return (
        <div className="group bg-neutral-900/50 rounded-[2.5rem] border border-neutral-800/50 overflow-hidden flex flex-col hover:border-red-600/50 transition-all duration-500 shadow-xl backdrop-blur-sm h-full">
            {/* IMAGEN */}
            <div className="relative h-56 w-full overflow-hidden flex-shrink-0">
                <Image
                    src={product.image || 'https://via.placeholder.com/400x300?text=Yamaguchi'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60" />
            </div>

            {/* CONTENIDO */}
            <div className="p-7 flex flex-col flex-grow">
                <div className="flex mb-4">
                    <span className="bg-red-600/10 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md border border-red-600/20 shadow-sm">
                        {product.category}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors mb-2 line-clamp-1 uppercase tracking-tighter">
                    {product.name}
                </h3>

                <p className="text-neutral-500 text-xs line-clamp-3 leading-relaxed mb-6 italic">
                    {product.description}
                </p>

                {/* FOOTER */}
                <div className="mt-auto pt-5 border-t border-neutral-800/50 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-red-600 text-[10px] uppercase font-black tracking-widest mb-1">Precio</span>
                        <span className="text-2xl font-black text-white leading-none">${product.price}</span>
                    </div>

                    <div className="flex gap-2">
                        {isAdmin ? (
                            <AdminActions
                                onEdit={() => onEdit(product)}
                                onDelete={() => onDelete(product.id)}
                            />
                        ) : (
                            <button
                                onClick={handleAddToCart} // ACTIVAMOS EL BOTÓN
                                className="bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest shadow-lg shadow-red-900/40 active:scale-95"
                            >
                                Comprar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-componente para botones de Admin
const AdminActions = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <>
        <button
            onClick={onEdit}
            className="p-3 rounded-xl bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-white hover:text-black transition-all active:scale-90"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        </button>
        <button
            onClick={onDelete}
            className="p-3 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white transition-all active:scale-90"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </>
);
