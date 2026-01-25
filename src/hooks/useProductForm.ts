import { useState } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { uploadToCloudinary } from '@/lib/upload';
import { toast } from 'sonner';

export const useProductForm = (initialData?: Product) => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        category: initialData?.category || 'Simples',
        price: initialData?.price || '',
        stock: initialData?.stock || '',
        image: initialData?.image || '',
    });

    const [uploading, setUploading] = useState(false);

    const handleInputChange = (field: keyof ProductFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            handleInputChange('image', url);
            toast.success('Imagen lista para la carta');
        } catch {
            toast.error("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    return { formData, uploading, handleInputChange, handleImageUpload };
};
