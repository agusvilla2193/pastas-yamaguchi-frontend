import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';
import axios from 'axios';

export function useProfile() {
    const { user, api, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);

        try {
            const response = await api.patch(`/users/${user.id}`, formData);
            login(response.data);
            toast.success('¡Perfil actualizado, Maestro!');
        } catch (err: unknown) {
            let errorMessage = 'Error al actualizar los datos';

            if (axios.isAxiosError(err)) {
                const serverMessage = err.response?.data?.message;
                errorMessage = Array.isArray(serverMessage)
                    ? serverMessage[0]
                    : serverMessage || errorMessage;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        formData,
        setFormData,
        isLoading,
        handleSubmit
    };
}
