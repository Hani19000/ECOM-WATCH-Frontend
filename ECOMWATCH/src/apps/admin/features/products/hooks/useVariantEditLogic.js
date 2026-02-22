import { useState, useEffect, useCallback } from 'react';
import { AdminProductService } from '../api/adminProduct.service';
import toast from 'react-hot-toast';

export const useVariantEditLogic = (variant, isOpen, onClose, onSuccess) => {
    const [formData, setFormData] = useState({ sku: '', price: '', size: '', color: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && variant) {
            setFormData({
                sku: variant.sku || '',
                price: variant.price || '',
                size: variant.attributes?.size || variant.size || '',
                color: variant.attributes?.color || variant.color || ''
            });
        }
    }, [variant, isOpen]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Le backend attend sku, price, et attributes (JSON)
            const payload = {
                sku: formData.sku,
                price: parseFloat(formData.price),
                attributes: {
                    size: formData.size,
                    color: formData.color
                }
            };

            await AdminProductService.updateVariant(variant.id, payload);
            toast.success('Variante mise à jour avec succès !');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la modification');
        } finally {
            setSaving(false);
        }
    }, [variant, formData, onClose, onSuccess]);

    return { formData, saving, handleChange, handleSubmit };
};