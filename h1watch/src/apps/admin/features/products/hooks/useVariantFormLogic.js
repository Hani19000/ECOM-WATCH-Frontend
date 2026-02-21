import { useState, useCallback } from 'react';
import { AdminProductService } from '../api/adminProduct.service';
import toast from 'react-hot-toast';

export const useVariantFormLogic = (productId, isOpen, onClose, onSuccess) => {
    const [formData, setFormData] = useState({ sku: '', price: '', size: '', color: '', initialStock: '0' });
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleImageChange = useCallback((e) => {
        if (e.target.files?.[0]) setImageFile(e.target.files[0]);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = new FormData();
            payload.append('sku', formData.sku);
            payload.append('price', formData.price);
            payload.append('size', formData.size);
            payload.append('initialStock', formData.initialStock);
            payload.append('attributes', JSON.stringify({ color: formData.color }));
            if (imageFile) payload.append('image', imageFile);

            await AdminProductService.addVariant(productId, payload);
            toast.success('Variante ajoutée avec succès !');
            setFormData({ sku: '', price: '', size: '', color: '', initialStock: '0' });
            setImageFile(null);
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout de la variante');
        } finally {
            setSaving(false);
        }
    }, [productId, formData, imageFile, onClose, onSuccess]);

    return { formData, imageFile, saving, handleChange, handleImageChange, handleSubmit };
};