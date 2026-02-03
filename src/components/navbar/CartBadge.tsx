import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface CartBadgeProps {
    count: number;
    isAuthenticated: boolean;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ count, isAuthenticated }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleCartClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error("Acceso restringido", {
                description: "Debes iniciar sesión para ver tu pedido.",
                action: {
                    label: "INGRESAR",
                    onClick: () => router.push(`/login?redirect=${pathname}`)
                }
            });
        }
    };

    return (
        <Link
            href="/cart"
            onClick={handleCartClick}
            className="relative group p-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in">
                    {count}
                </span>
            )}
        </Link>
    );
};
