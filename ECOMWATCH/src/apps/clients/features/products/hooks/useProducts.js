import { useQuery } from '@tanstack/react-query';
import ProductService from '../api/product.service';

/**
 * Récupère tous les produits avec filtres optionnels.
 * placeholderData conserve les données précédentes pendant le refetch
 * pour éviter un flash de skeleton lors des changements de filtre.
 */
export const useProducts = (filters = {}) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => ProductService.getAll(filters),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 2,
        retry: 1,
    });
};

/**
 * Récupère les 4 produits mis en avant pour la home page.
 *
 * Séparé de useProducts pour avoir sa propre clé de cache et son propre
 * staleTime : la sélection featured change moins souvent que le catalogue complet.
 */
export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => ProductService.findFeatured(),
        staleTime: 1000 * 60 * 10,
        retry: 1,
    });
};

/**
 * Récupère un seul produit par ID ou slug.
 * La requête ne s'exécute pas tant que idOrSlug est absent (navigation en cours).
 */
export const useProduct = (idOrSlug) => {
    return useQuery({
        queryKey: ['product', idOrSlug],
        queryFn: () => ProductService.getOne(idOrSlug),
        enabled: !!idOrSlug,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};

export default useProducts;