import { useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

export function useLoginForm(redirectPath: string) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, api } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { user } = response.data;

            login(user);
            toast.success(`¡Hola de nuevo, ${user.firstName}!`);
            router.push(redirectPath);

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                // Aca capturo el mensaje exacto que configuro en el Backend
                const message = err.response?.data?.message;

                if (err.response?.status === 400 && message.includes('confirmar')) {
                    toast.error('Cuenta inactiva', {
                        description: message,
                        duration: 5000
                    });
                } else if (err.response?.status === 401) {
                    toast.error('Credenciales incorrectas');
                } else {
                    toast.error('Error al iniciar sesión');
                }
            } else {
                toast.error('Error de conexión');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        handleSubmit
    };
}
