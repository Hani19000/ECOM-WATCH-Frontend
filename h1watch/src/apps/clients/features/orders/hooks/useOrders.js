import { useState, useCallback, useEffect } from 'react';
import api from '../../../../../api/axios.config';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore'
import logger from '../../../../../core/utils/logger';
import toast from 'react-hot-toast';

export const useOrders = () => {
    const { isAuthenticated } = useAuthStore();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async (options = {}) => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (options.page) params.append('page', options.page);
            if (options.limit) params.append('limit', options.limit);
            if (options.status) params.append('status', options.status);

            const { data } = await api.get(`/users/me/orders?${params.toString()}`);

            if (!data || !data.data || !Array.isArray(data.data.orders)) {
                throw new Error('Format de réponse API invalide');
            }

            const responseOrders = data.data.orders;
            const responsePagination = data.data.pagination;

            setOrders(responseOrders);
            setPagination(responsePagination || {
                page: 1,
                limit: 10,
                total: responseOrders.length,
                totalPages: 1
            });

        } catch (err) {
            logger.error('[useOrders] Échec du chargement des commandes:', err);

            let message = "Impossible de charger l'historique";
            if (err.response?.status === 500) {
                message = "Erreur serveur. Nos équipes sont informées.";
            } else if (err.response?.status === 401) {
                message = "Session expirée, veuillez vous reconnecter";
            }

            setError(message);
            toast.error(message);
            setOrders([]);
            setPagination(null);

        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        } else {
            setOrders([]);
            setPagination(null);
            setLoading(false);
        }
    }, [isAuthenticated, fetchOrders]);

    const refetch = useCallback(() => {
        if (!isAuthenticated) return Promise.resolve();
        return fetchOrders({
            page: pagination?.page || 1,
            limit: pagination?.limit || 10
        });
    }, [pagination, fetchOrders, isAuthenticated]);

    return {
        orders,
        loading,
        pagination,
        error,
        fetchOrders,
        refetch
    };
};