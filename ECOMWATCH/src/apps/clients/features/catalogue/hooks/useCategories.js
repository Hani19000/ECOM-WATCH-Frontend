import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '../api/category.service';

/**
 * Fournit l'état de chargement et le cache des catégories.
 * Configure un staleTime long car les catégories e-commerce mutent très rarement.
 */
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: CategoryService.getAll,
        staleTime: 1000 * 60 * 60,
        retry: 1,
    });
};