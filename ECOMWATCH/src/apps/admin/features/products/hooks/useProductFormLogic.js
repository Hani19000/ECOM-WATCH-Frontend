import { useState, useEffect, useCallback } from 'react';
import { AdminProductService } from '../api/adminProduct.service';
import toast from 'react-hot-toast';

export const useProductFormLogic = (productId, isOpen, onClose, onSuccess) => {
    const [categories, setCategories] = useState([]);
    const [variants, setVariants] = useState([]);
    const [formData, setFormData] = useState({
        name: '', slug: '', description: '', status: 'DRAFT',
        categoryIds: [],
        sku: '', price: '', size: '', color: '', initialStock: '0'
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const initForm = async () => {
            setLoading(true);
            try {
                const cats = await AdminProductService.getCategories();
                setCategories(cats);

                if (productId && productId !== 'new') {
                    const product = await AdminProductService.getOne(productId);

                    const productCategoryIds = product?.categories?.map(c => c.id) || [];

                    const productVariants = product?.variants || product?.variantsPreview || product?.variants_preview || [];
                    setVariants(Array.isArray(productVariants) ? productVariants : []);

                    setFormData({
                        name: product?.name || '',
                        slug: product?.slug || '',
                        description: product?.description || '',
                        status: product?.status || 'DRAFT',
                        categoryIds: productCategoryIds, // <-- Tableau d'IDs
                        sku: '', price: '', size: '', color: '', initialStock: '0'
                    });
                } else {
                    setVariants([]);
                    setFormData({
                        name: '', slug: '', description: '', status: 'DRAFT',
                        categoryIds: [], // <-- Tableau vide
                        sku: '', price: '', size: '', color: '', initialStock: '0'
                    });
                }
            } catch {
                toast.error('Erreur de chargement');
                onClose();
            } finally {
                setLoading(false);
            }
        };
        initForm();
    }, [productId, isOpen, onClose]);

    // <-- MODIFICATION : Prise en charge du select "multiple"
    const handleChange = useCallback((e) => {
        const { name, value, type, selectedOptions } = e.target;

        const finalValue = type === 'select-multiple'
            ? Array.from(selectedOptions, option => option.value)
            : value;

        setFormData(prev => ({
            ...prev, [name]: finalValue,
            ...(name === 'name' && productId === 'new' ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
        }));
    }, [productId]);

    const handleImageChange = useCallback((e) => {
        if (e.target.files?.[0]) setImageFile(e.target.files[0]);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (productId === 'new') {
                const payload = new FormData();
                payload.append('name', formData.name);
                payload.append('slug', formData.slug);
                payload.append('description', formData.description);
                payload.append('status', formData.status);

                if (formData.categoryIds && formData.categoryIds.length > 0) {
                    formData.categoryIds.forEach(id => {
                        payload.append('categoryIds', id);
                    });
                }

                if (imageFile) payload.append('image', imageFile);

                const variantData = {
                    sku: formData.sku, price: parseFloat(formData.price), size: formData.size,
                    initialStock: parseInt(formData.initialStock, 10), attributes: { color: formData.color }
                };
                payload.append('variant', JSON.stringify(variantData));

                await AdminProductService.create(payload);
                toast.success('Produit créé avec succès');
            } else {
                const payload = {
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    status: formData.status,
                    categoryIds: formData.categoryIds
                };

                await AdminProductService.update(productId, payload);
                toast.success('Produit mis à jour');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    }, [productId, formData, imageFile, onClose, onSuccess]);

    return { categories, variants, formData, imageFile, loading, saving, handleChange, handleImageChange, handleSubmit };
};