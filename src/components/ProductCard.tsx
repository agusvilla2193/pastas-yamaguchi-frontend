'use client';

import Image from 'next/image';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthCore'; // Importamos el contexto de Auth
import { useRouter } from 'next/navigation'; // Importamos el router de Next
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
    isAdmin: boolean;
    onEdit: (p: Product) => void;
    onDelete: (id: number) => void;
}

export const ProductCard = ({ product, isAdmin, onEdit, onDelete }: ProductCardProps) => {
    const { addToCart, cart } = useCart();
    const { isAuthenticated } = useAuth(); // Extraemos el estado de sesión
    const router = useRouter();

    const itemInCart = cart?.find(item => item.id === product.id);
    const isOutOfStock = product.stock <= 0;

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        // BLOQUEO DE SEGURIDAD: Si no está logueado, redirige al login con un aviso
        if (!isAuthenticated) {
            toast.error('¡Inicia sesión para pedir!', {
                description: "Debes ser parte del dojo para realizar un pedido.",
                action: {
                    label: 'INGRESAR',
                    onClick: () => router.push('/login')
                },
            });
            return;
        }

        // Si está logueado, procede normalmente
        addToCart(product);
        toast.success(`${product.name} agregada`, {
            description: "Se sumó a tu pedido artesanal.",
            icon: '🍜'
        });
    };

    const cardStatusStyles = isOutOfStock
        ? 'border-neutral-800 opacity-60 grayscale-[0.5]'
        : 'border-neutral-800/50 hover:border-red-600/50';

    return (
        <div className={`group bg-neutral-900/50 rounded-[2.5rem] border overflow-hidden flex flex-col transition-all duration-500 shadow-xl backdrop-blur-sm h-full relative ${cardStatusStyles}`}>

            <Badges isOutOfStock={isOutOfStock} quantity={itemInCart?.quantity} />

            <div className="relative h-56 w-full overflow-hidden flex-shrink-0">
                <Image
                    src={product.image || 'https://via.placeholder.com/400x300?text=Yamaguchi'}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform duration-700 ${!isOutOfStock && 'group-hover:scale-110'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60" />
            </div>

            <div className="p-7 flex flex-col flex-grow">
                <CategoryTag category={product.category} isOutOfStock={isOutOfStock} />

                <h3 className={`text-xl font-bold mb-2 line-clamp-1 uppercase tracking-tighter transition-colors ${isOutOfStock ? 'text-neutral-500' : 'text-white group-hover:text-red-500'}`}>
                    {product.name}
                </h3>

                <p className="text-neutral-500 text-xs line-clamp-3 leading-relaxed mb-6 italic">
                    {product.description}
                </p>

                <div className="mt-auto pt-5 border-t border-neutral-800/50 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-red-600 text-[10px] uppercase font-black tracking-widest mb-1">Precio</span>
                        <span className={`text-2xl font-black leading-none ${isOutOfStock ? 'text-neutral-600' : 'text-white'}`}>
                            ${product.price}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {isAdmin ? (
                            <AdminActions onEdit={() => onEdit(product)} onDelete={() => onDelete(product.id)} />
                        ) : (
                            <BuyButton
                                onClick={handleAddToCart}
                                isOutOfStock={isOutOfStock}
                                hasItem={!!itemInCart}
                                isAuthenticated={isAuthenticated} // Pasamos el estado al botón
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTES ACTUALIZADOS ---

const BuyButton = ({
    onClick,
    isOutOfStock,
    hasItem,
    isAuthenticated
}: {
    onClick: () => void;
    isOutOfStock: boolean;
    hasItem: boolean;
    isAuthenticated: boolean;
}) => (
    <button
        onClick={onClick}
        disabled={isOutOfStock}
        className={`px-7 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shadow-lg active:scale-95 ${isOutOfStock
                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/40'
            }`}
    >
        {isOutOfStock
            ? 'Agotado'
            : !isAuthenticated
                ? 'Ingresar para comprar'
                : (hasItem ? 'Agregar más' : 'Comprar')
        }
    </button>
);

// Los demás sub-componentes se mantienen igual...
const Badges = ({ isOutOfStock, quantity }: { isOutOfStock: boolean; quantity?: number }) => (
    <>
        {isOutOfStock && (
            <div className="absolute top-4 left-4 z-20 bg-neutral-950 text-red-500 text-[9px] font-black px-3 py-1.5 rounded-full border border-red-500/50 uppercase tracking-widest animate-pulse">
                Sin Stock
            </div>
        )}
        {quantity && quantity > 0 && !isOutOfStock && (
            <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-900/50 border border-red-500 animate-in zoom-in duration-300">
                {quantity} EN CARRITO
            </div>
        )}
    </>
);

const CategoryTag = ({ category, isOutOfStock }: { category: string; isOutOfStock: boolean }) => (
    <div className="flex mb-4">
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md border shadow-sm ${isOutOfStock ? 'bg-neutral-800 text-neutral-500 border-neutral-700' : 'bg-red-600/10 text-red-500 border-red-600/20'}`}>
            {category}
        </span>
    </div>
);

const AdminActions = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <div className="flex gap-2">
        <button onClick={onEdit} className="p-3 rounded-xl bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-white hover:text-black transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        </button>
        <button onClick={onDelete} className="p-3 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </div>
);
