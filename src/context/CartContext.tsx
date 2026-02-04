'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartContextType } from '@/types/cart';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    // Persistencia automática con el hook modularizado
    const [cart, setCart] = useLocalStorage<CartItem[]>('yamaguchi_cart', []);

    // Memoizamos el carrito asegurando que siempre sea un array para evitar errores de iteración
    const safeCart = useMemo(() => Array.isArray(cart) ? cart : [], [cart]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const currentCart = Array.isArray(prev) ? prev : [];
            const existing = currentCart.find(item => item.id === product.id);

            if (existing) {
                return currentCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // Si es un producto nuevo, lo agregamos con cantidad 1
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        setCart(prev => {
            const currentCart = Array.isArray(prev) ? prev : [];
            return currentCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(0, newQuantity) }
                    : item
            ).filter(item => item.quantity > 0); // Si la cantidad es 0, lo eliminamos
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => {
            const currentCart = Array.isArray(prev) ? prev : [];
            return currentCart.filter(item => item.id !== productId);
        });
    };

    const clearCart = () => {
        setCart([]);
        // El hook useLocalStorage se encargará de limpiar el storage automáticamente
    };

    // Totales memorizados para evitar re-cálculos innecesarios
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
    if (!context) {
        throw new Error('useCart debe ser usado dentro de CartProvider');
    }
    return context;
};
