import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../../../../../api/axios.config';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore';
import logger from '../../../../../core/utils/logger';
import toast from 'react-hot-toast';

// AJOUT DE L'IMPORT MANQUANT ICI :
import { GuestOrderService } from '../api/GuestOrder.service';

import {
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS,
    ACTIVE_ORDER_STATUSES,
    COMPLETED_ORDER_STATUSES
} from '../../../../../core/constants/orderStatus';

const POLLING_INTERVAL = 30000; // 30 secondes
const MAX_POLLING_ERRORS = 100; // Arrêter après 3 erreurs consécutives

export const useOrderTracking = (initialOrderId = null) => {
    const { isAuthenticated } = useAuthStore();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [rateLimitReached, setRateLimitReached] = useState(false);

    const pollingIntervalRef = useRef(null);
    const errorCountRef = useRef(0);
    const guestDataRef = useRef(null);

    const stopPolling = useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            guestDataRef.current = null;
            setIsPolling(false);
            logger.info('[useOrderTracking] Polling arrêté');
        }
    }, []);

    /**
     * Helper pour normaliser les données de la commande (force la présence de items)
     */
    const normalizeOrderData = (data) => {
        const orderData = data.data?.order || data.data;
        if (orderData) {
            // On s'assure que le tableau items existe toujours pour éviter les erreurs d'affichage
            orderData.items = orderData.items || orderData.OrderItems || [];
        }
        return orderData;
    };

    const trackAuthenticatedOrder = useCallback(async (orderId) => {
        if (!orderId) return;

        try {
            setLoading(true);
            setError(null);

            const { data } = await api.get(`/orders/${orderId}`);
            const orderData = normalizeOrderData(data);

            if (!orderData) throw new Error('Commande introuvable');

            setOrder(orderData);
            setIsGuest(false);
            errorCountRef.current = 0;

            if (ACTIVE_ORDER_STATUSES.includes(orderData.status)) {
                startAuthenticatedPolling(orderId);
            }
        } catch (err) {
            logger.error('[useOrderTracking] Erreur auth tracking:', err);
            setError(err.response?.status === 403 ? 'Accès non autorisé' : 'Commande introuvable');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, stopPolling]);

    const trackGuestOrder = useCallback(async (orderNumber, email) => {
        if (!orderNumber || !email) {
            toast.error('Numéro de commande et email requis');
            return;
        }

        stopPolling();

        try {
            setLoading(true);
            setError(null);
            setRateLimitReached(false);

            const { data } = await api.post('/orders/track-guest', { orderNumber, email });
            const orderData = normalizeOrderData(data);

            if (!orderData) throw new Error('Format de réponse invalide');

            setOrder(orderData);
            setIsGuest(true);
            guestDataRef.current = { orderNumber, email };

            if (ACTIVE_ORDER_STATUSES.includes(orderData.status)) {
                startGuestPolling(orderNumber, email);
            }
            toast.success('Commande trouvée !');
        } catch (err) {
            if (err.response?.status === 429) {
                setRateLimitReached(true);
                setError('Trop de tentatives. Réessayez plus tard.');
            } else {
                setError('Commande introuvable. Vérifiez vos informations.');
            }
        } finally {
            setLoading(false);
        }
    }, [stopPolling]);

    const startGuestPolling = useCallback((orderNumber, email) => {
        if (pollingIntervalRef.current) return;
        setIsPolling(true);
        pollingIntervalRef.current = setInterval(async () => {
            try {
                const { data } = await api.post('/orders/track-guest', { orderNumber, email });
                const updatedOrder = normalizeOrderData(data);
                if (updatedOrder) {
                    setOrder(updatedOrder);
                    if (COMPLETED_ORDER_STATUSES.includes(updatedOrder.status)) stopPolling();
                }
            } catch {
                errorCountRef.current += 1;
                if (errorCountRef.current >= MAX_POLLING_ERRORS) stopPolling();
            }
        }, POLLING_INTERVAL);
    }, [stopPolling]);

    const startAuthenticatedPolling = useCallback((orderId) => {
        if (pollingIntervalRef.current) return;
        setIsPolling(true);
        pollingIntervalRef.current = setInterval(async () => {
            try {
                const { data } = await api.get(`/orders/${orderId}`);
                const updatedOrder = normalizeOrderData(data);
                if (updatedOrder) {
                    setOrder(updatedOrder);
                    if (COMPLETED_ORDER_STATUSES.includes(updatedOrder.status)) stopPolling();
                }
            } catch {
                errorCountRef.current += 1;
                if (errorCountRef.current >= MAX_POLLING_ERRORS) stopPolling();
            }
        }, POLLING_INTERVAL);
    }, [stopPolling]);

    /**
     * AUTO-LOAD : Se déclenche au montage si un ID est présent
     */
    useEffect(() => {
        if (initialOrderId) {
            const localOrders = GuestOrderService.getOrders();
            const localOrder = localOrders.find(
                (o) => o.id === initialOrderId || o.orderNumber === initialOrderId
            );

            if (localOrder && localOrder.email) {
                trackGuestOrder(localOrder.orderNumber, localOrder.email);
            } else if (isAuthenticated) {
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(initialOrderId);

                if (isUUID) {
                    trackAuthenticatedOrder(initialOrderId);
                } else {
                    setError("Numéro de commande invalide pour ce compte.");
                }
            } else {
                setError("Veuillez vous connecter ou utiliser le formulaire de suivi.");
            }
        }
        return () => stopPolling();
    }, [initialOrderId, isAuthenticated, trackAuthenticatedOrder, trackGuestOrder, stopPolling]);

    return {
        order,
        loading,
        isPolling,
        error,
        isGuest,
        rateLimitReached,
        trackGuestOrder,
        trackAuthenticatedOrder,
        stopPolling,
        getStatusLabel: (s) => ORDER_STATUS_LABELS[s] || s,
        getStatusColor: (s) => ORDER_STATUS_COLORS[s] || 'gray',
    };
};