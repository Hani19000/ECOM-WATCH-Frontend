import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../../../../../api/axios.config';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore';
import logger from '../../../../../core/utils/logger';
import toast from 'react-hot-toast';
import { GuestOrderService } from '../api/GuestOrder.service';

import {
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS,
    ACTIVE_ORDER_STATUSES,
    COMPLETED_ORDER_STATUSES
} from '../../../../../core/constants/orderStatus';

const POLLING_INTERVAL = 30000;
const MAX_POLLING_ERRORS = 3;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

    const stopPolling = useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            setIsPolling(false);
        }
    }, []);

    const normalizeOrderData = (data) => {
        const orderData = data.data?.order || data.data;
        if (orderData) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            if (ACTIVE_ORDER_STATUSES.includes(orderData.status)) {
                startGuestPolling(orderNumber, email);
            }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
     * AUTO-LOAD : Se déclenche au montage si un ID est présent.
     *
     * ORDRE DE PRIORITÉ :
     *   1. isAuthenticated ? → trackAuthenticatedOrder (Bearer token)
     *   2. Sinon, cherche dans localStorage → trackGuestOrder
     *
     * Pourquoi cette priorité :
     *   Une commande créée par un utilisateur connecté a user_id IS NOT NULL en base.
     *   L'API guest (/track-guest, /orders/:id sans Bearer) la rejette intentionnellement.
     *   Si l'user est connecté, on doit TOUJOURS utiliser le Bearer token, peu importe
     *   ce qui est dans le localStorage (qui peut contenir des données périmées).
     */
    useEffect(() => {
        if (!initialOrderId) return;

        // ── CAS 1 : Utilisateur authentifié ──────────────────────────────────
        // On utilise TOUJOURS le Bearer token pour les users connectés.
        // On ne consulte PAS le localStorage ici : même si la commande y existe,
        // elle aurait été créée avec user_id IS NOT NULL → l'API guest la rejetterait.
        if (isAuthenticated) {
            if (UUID_REGEX.test(initialOrderId)) {
                trackAuthenticatedOrder(initialOrderId);
            } else {
                // Numéro de commande textuel (ORD-...) : on cherche l'UUID dans
                // l'historique des commandes (OrderHistory appelle onSelectOrder avec order.id).
                // Si on arrive ici avec un orderNumber, c'est un bug d'appel — on le signale.
                setError('Format d\'identifiant invalide pour un compte connecté.');
                logger.warn('[useOrderTracking] Attendu un UUID pour un user authentifié, reçu :', initialOrderId);
            }
            return; // ← sortie explicite : on ne touche pas au localStorage
        }

        // ── CAS 2 : Utilisateur guest ─────────────────────────────────────────
        // Seulement ici on consulte le localStorage.
        const localOrder = GuestOrderService.getOrderByNumber(initialOrderId)
            ?? GuestOrderService.getOrders().find(o => o.id === initialOrderId);

        if (localOrder?.email) {
            trackGuestOrder(localOrder.orderNumber ?? localOrder.id, localOrder.email);
        } else {
            setError('Commande introuvable. Connectez-vous ou vérifiez vos informations.');
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