import { useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useCheckout() {
    const { user, api } = useAuth();
    const { cart, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePlaceOrder = async () => {
        // 1. Validaciones de seguridad previas
        if (!user) {
            toast.error("Sesión requerida");
            router.push('/login');
            return;
        }

        if (cart.length === 0) {
            toast.error("El carrito está vacío");
            router.push('/products');
            return;
        }

        if (!user.address || !user.phone) {
            toast.error("Datos incompletos", {
                description: "Por favor, completa tu dirección y teléfono en tu perfil antes de pedir."
            });
            router.push('/profile');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: Number(item.price)
                })),
                total: totalPrice,
                address: user.address,
                phone: user.phone
            };

            await api.post('/orders', orderData);

            toast.success('¡Pedido recibido!', {
                description: 'Estamos preparando tus pastas. ¡Kiai!'
            });

            // Limpiamos y redirigimos a la ruta correcta
            clearCart();
            router.push('/checkout/success');
        } catch (error) {
            console.error('Error en Checkout:', error);
            toast.error('Error al procesar el pedido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        user,
        cart,
        totalPrice,
        isSubmitting,
        handlePlaceOrder
    };
}
