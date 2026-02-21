import { useState, useEffect, useCallback } from 'react';
import { AdminProductService } from '../api/adminProduct.service';
import toast from 'react-hot-toast';

export const useProductFormLogic = (productId, isOpen, onClose, onSuccess) => {
    const [categories, setCategories] = useState([]);
    const [variants, setVariants] = useState([]); // NOUVEAU : Stocker les variantes
    const [formData, setFormData] = useState({
        name: '', slug: '', description: '', status: 'DRAFT', categoryIds: '',
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
                    const defaultCategoryId = product?.categories?.[0]?.id || '';

                    // On récupère les variantes pour les afficher dans le tiroir
                    const productVariants = product?.variants || product?.variantsPreview || product?.variants_preview || [];
                    setVariants(Array.isArray(productVariants) ? productVariants : []);

                    setFormData({
                        name: product?.name || '',
                        slug: product?.slug || '',
                        description: product?.description || '',
                        status: product?.status || 'DRAFT',
                        categoryIds: defaultCategoryId,
                        sku: '', price: '', size: '', color: '', initialStock: '0'
                    });
                } else {
                    setVariants([]);
                    setFormData({
                        name: '', slug: '', description: '', status: 'DRAFT', categoryIds: '',
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

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value,
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
                // CREATION : FormData car on a une image et multer est actif
                const payload = new FormData();
                payload.append('name', formData.name);
                payload.append('slug', formData.slug);
                payload.append('description', formData.description);
                payload.append('status', formData.status);
                if (formData.categoryIds) payload.append('categoryIds', JSON.stringify([formData.categoryIds]));
                if (imageFile) payload.append('image', imageFile);

                const variantData = {
                    sku: formData.sku, price: parseFloat(formData.price), size: formData.size,
                    initialStock: parseInt(formData.initialStock, 10), attributes: { color: formData.color }
                };
                payload.append('variant', JSON.stringify(variantData));

                await AdminProductService.create(payload);
                toast.success('Produit créé avec succès');
            } else {
                // MODIFICATION : JSON pur car la route backend n'a pas multer
                const payload = {
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    status: formData.status,
                    categoryIds: formData.categoryIds ? [formData.categoryIds] : []
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