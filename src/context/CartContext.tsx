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
    updateQuantity: (productId: number, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
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

    // --- NUEVA FUNCIÓN ---
    const updateQuantity = (productId: number, newQuantity: number) => {
        setCart(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
            ).filter(item => item.quantity > 0) // Si la cantidad llega a 0, se elimina solo
        );
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice
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
