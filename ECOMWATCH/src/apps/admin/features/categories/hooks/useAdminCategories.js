import { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminCategoryService } from '../api/adminCategory.service';
import toast from 'react-hot-toast';

export const useAdminCategories = () => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedCategories = await AdminCategoryService.getAll();
            setCategoriesList(fetchedCategories);
        } catch {
            toast.error('Impossible de charger les catégories.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSearchChange = useCallback((value) => {
        setSearchQuery(value);
    }, []);

    /**
     * Filtrage local — le backend ne gère pas la recherche pour les catégories.
     */
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categoriesList;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return categoriesList.filter(category =>
            category.name?.toLowerCase().includes(lowerCaseQuery) ||
            category.slug?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [categoriesList, searchQuery]);

    const requestCategoryDeletion = useCallback((categoryId) => {
        setCategoryToDelete(categoryId);
    }, []);

    const cancelCategoryDeletion = useCallback(() => {
        setCategoryToDelete(null);
    }, []);

    const confirmCategoryDeletion = useCallback(async () => {
        if (!categoryToDelete) return;
        try {
            await AdminCategoryService.delete(categoryToDelete);
            toast.success('Catégorie supprimée avec succès.');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression.');
        } finally {
            setCategoryToDelete(null);
        }
    }, [categoryToDelete, fetchCategories]);

    return {
        state: { filteredCategories, isLoading, searchQuery, categoryToDelete },
        actions: { handleSearchChange, requestCategoryDeletion, cancelCategoryDeletion, confirmCategoryDeletion, fetchCategories }
    };
};