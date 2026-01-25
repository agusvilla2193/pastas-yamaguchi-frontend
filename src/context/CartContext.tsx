'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartContextType } from '@/types/cart';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    // Usamos el hook modularizado
    const [cart, setCart] = useLocalStorage<CartItem[]>('yamaguchi_cart', []);

    // Aseguramos que 'cart' sea siempre un array antes de operar
    const safeCart = useMemo(() => Array.isArray(cart) ? cart : [], [cart]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const currentCart = Array.isArray(prev) ? prev : [];
            const existing = currentCart.find(item => item.id === product.id);
            if (existing) {
                return currentCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        setCart(prev => {
            const currentCart = Array.isArray(prev) ? prev : [];
            return currentCart.map(item =>
                item.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
            ).filter(item => item.quantity > 0);
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => {
            const currentCart = Array.isArray(prev) ? prev : [];
            return currentCart.filter(item => item.id !== productId);
        });
    };

    const clearCart = () => setCart([]);

    // Cálculos memorizados
    const totalItems = useMemo(() =>
        safeCart.reduce((acc, item) => acc + item.quantity, 0),
        [safeCart]);

    const totalPrice = useMemo(() =>
        safeCart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0),
        [safeCart]);

    return (
        <CartContext.Provider value={{
            cart: safeCart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart debe ser usado dentro de CartProvider');
    return context;
};
