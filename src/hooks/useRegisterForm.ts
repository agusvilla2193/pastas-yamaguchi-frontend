import { useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

export function useRegisterForm() {
    const { api } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const executeRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // El backend ahora debería procesar el mail sin 'await' para responder rápido
            await api.post('/auth/register', formData);

            // Informo al usuario y lo redirijo al login 
            // para que espere la confirmación de su mail
            toast.success('¡Registro casi completo! Revisa tu email para activar tu cuenta.', {
                duration: 8000,
            });

            router.push('/login');

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message;
                if (Array.isArray(message)) {
                    message.forEach(msg => toast.error(msg));
                } else {
                    toast.error(message || 'Error al registrarse');
                }
            } else {
                toast.error('Ocurrió un error inesperado');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, isLoading, handleInputChange, executeRegister };
}
