import { useState, useEffect, useCallback } from 'react';
import { AdminPromotionService } from '../api/adminPromotion.service';
import toast from 'react-hot-toast';

export const useAdminPromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [promoToDelete, setPromoToDelete] = useState(null);

    const fetchPromotions = useCallback(async () => {
        setLoading(true);
        try {
            const result = await AdminPromotionService.getAll({
                page: pagination.page,
                limit: 10
            });
            setPromotions(result.data || []);
            setPagination(prev => ({ ...prev, ...result.pagination }));
        } catch {
            toast.error('Impossible de charger les promotions.');
        } finally {
            setLoading(false);
        }
    }, [pagination.page]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    }, [pagination.totalPages]);

    const handleToggleStatus = useCallback(async (id) => {
        try {
            await AdminPromotionService.toggle(id);
            toast.success('Statut mis à jour');
            fetchPromotions();
        } catch {
            toast.error('Erreur lors du changement de statut');
        }
    }, [fetchPromotions]);

    const confirmDelete = useCallback(async () => {
        if (!promoToDelete) return;
        try {
            await AdminPromotionService.delete(promoToDelete);
            toast.success('Promotion supprimée avec succès');
            fetchPromotions();
        } catch {
            toast.error('Erreur lors de la suppression');
        } finally {
            setPromoToDelete(null);
        }
    }, [promoToDelete, fetchPromotions]);

    return {
        state: { promotions, loading, pagination, promoToDelete },
        actions: {
            handlePageChange,
            handleToggleStatus,
            requestDelete: setPromoToDelete,
            cancelDelete: () => setPromoToDelete(null),
            confirmDelete,
            fetchPromotions
        }
    };
};