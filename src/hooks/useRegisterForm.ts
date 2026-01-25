import { useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

export function useRegisterForm() {
    const { api, login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const executeRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', formData);
            const { access_token, user } = response.data;

            if (access_token && user) {
                login(access_token, user);
                toast.success(`¡Bienvenido al Dojo, ${user.firstName}!`);
                router.push('/products');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Error al registrarse';
                toast.error(message);
            } else {
                toast.error('Ocurrió un error inesperado');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, isLoading, handleInputChange, executeRegister };
}
