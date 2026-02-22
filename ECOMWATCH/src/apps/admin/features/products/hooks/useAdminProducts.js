import { useState, useEffect, useCallback } from 'react';
import { AdminProductService } from '../api/adminProduct.service';
import toast from 'react-hot-toast';

export const useAdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // NOUVEAU : État pour gérer le produit en cours de suppression
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const result = await AdminProductService.getAll({
                page: pagination.page,
                limit: 10,
                search: debouncedSearch
            });
            setProducts(result.products);
            setPagination(prev => ({ ...prev, ...result.pagination }));
        } catch {
            toast.error('Impossible de charger le catalogue.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, debouncedSearch]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearchChange = useCallback((value) => {
        setSearchQuery(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    }, [pagination.totalPages]);

    // --- NOUVELLE LOGIQUE DE SUPPRESSION SANS ALERT() ---

    // 1. L'utilisateur clique sur la poubelle
    const requestDeleteProduct = useCallback((productId) => {
        setProductToDelete(productId);
    }, []);

    // 2. L'utilisateur annule dans la modale
    const cancelDeleteProduct = useCallback(() => {
        setProductToDelete(null);
    }, []);

    // 3. L'utilisateur confirme dans la modale
    const confirmDeleteProduct = useCallback(async () => {
        if (!productToDelete) return;

        try {
            await AdminProductService.delete(productToDelete);
            toast.success('Produit supprimé avec succès');
            fetchProducts();
        } catch {
            toast.error('Échec de la suppression');
        } finally {
            setProductToDelete(null); // Ferme la modale
        }
    }, [productToDelete, fetchProducts]);

    return {
        // Ajout de productToDelete dans le state exposé
        state: { products, loading, searchQuery, pagination, productToDelete },
        // Exposition des 3 nouvelles fonctions au lieu de handleDeleteProduct
        actions: { handleSearchChange, handlePageChange, requestDeleteProduct, cancelDeleteProduct, confirmDeleteProduct, fetchProducts }
    };
};