import { useState, useEffect, useCallback } from 'react';
import { AdminCategoryService } from '../api/adminCategory.service';
import toast from 'react-hot-toast';

export const useCategoryFormLogic = (initialCategoryData, isDrawerOpen, onCloseDrawer, onSuccessCallback) => {
    const [categoryFormData, setCategoryFormData] = useState({ name: '', slug: '' });
    const [isSavingInProgress, setIsSavingInProgress] = useState(false);

    // Synchronisation de l'état local avec les données injectées (Création vs Édition)
    useEffect(() => {
        if (isDrawerOpen && initialCategoryData) {
            setCategoryFormData({
                name: initialCategoryData.name || '',
                slug: initialCategoryData.slug || ''
            });
        } else if (isDrawerOpen) {
            setCategoryFormData({ name: '', slug: '' });
        }
    }, [initialCategoryData, isDrawerOpen]);

    const handleInputCategoryChange = useCallback((event) => {
        const { name, value } = event.target;
        setCategoryFormData(previousState => {
            const updatedState = { ...previousState, [name]: value };

            // Génération automatique du slug pour faciliter le SEO et l'UX
            if (name === 'name' && !initialCategoryData) {
                updatedState.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return updatedState;
        });
    }, [initialCategoryData]);

    const submitCategoryForm = useCallback(async (event) => {
        event.preventDefault();
        setIsSavingInProgress(true);

        try {
            const payload = {
                name: categoryFormData.name.trim(),
                slug: categoryFormData.slug.trim()
            };

            if (initialCategoryData?.id) {
                await AdminCategoryService.update(initialCategoryData.id, payload);
                toast.success('Catégorie mise à jour.');
            } else {
                await AdminCategoryService.create(payload);
                toast.success('Nouvelle catégorie créée.');
            }

            onSuccessCallback();
            onCloseDrawer();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setIsSavingInProgress(false);
        }
    }, [categoryFormData, initialCategoryData, onCloseDrawer, onSuccessCallback]);

    return { categoryFormData, isSavingInProgress, handleInputCategoryChange, submitCategoryForm };
};