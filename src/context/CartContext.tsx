'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. Inicializamos el estado directamente con una función anónima.
    // Esto se ejecuta una sola vez al crear el componente y es la forma
    // recomendada por React para cargar datos de sistemas externos como localStorage.
    const [cart, setCart] = useState<CartItem[]>(() => {
        // Verificamos si estamos en el navegador (en el servidor localStorage es undefined)
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('yamaguchi_cart');
            if (savedCart) {
                try {
                    return JSON.parse(savedCart);
                } catch (error) {
                    console.error("Error al inicializar el carrito", error);
                    return [];
                }
            }
        }
        return [];
    });

    // 2. Sincronizamos el localStorage cuando el carrito cambie.
    // Esto es una sincronización legítima y no dispara el error de ESLint.
    useEffect(() => {
        localStorage.setItem('yamaguchi_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart debe ser usado dentro de CartProvider');
    return context;
};
