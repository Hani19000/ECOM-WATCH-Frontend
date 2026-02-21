import { useQuery } from '@tanstack/react-query';
import ProductService from '../api/product.service';

/**
 * Hook pour récupérer tous les produits avec filtres
 * @param {Object} filters - { category, search, page, limit }
 * @returns {Object} Query result avec data, isLoading, isError, error, refetch
 */
export const useProducts = (filters = {}) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => ProductService.getAll(filters),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 2, // Cache 2 minutes
        retry: 1,
    });
};

/**
 * Hook pour récupérer un seul produit par ID ou slug
 * @param {string} idOrSlug - Identifiant ou slug du produit
 * @returns {Object} Query result avec data, isLoading, isError, error
 */
export const useProduct = (idOrSlug) => {
    return useQuery({
        queryKey: ['product', idOrSlug],
        queryFn: () => ProductService.getOne(idOrSlug),
        enabled: !!idOrSlug,
        staleTime: 1000 * 60 * 5, // Cache 5 minutes
        retry: 1,
    });
};

export default useProducts;