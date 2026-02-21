import { useState, useEffect } from 'react';
import api from '../../../../../api/axios.config';
import logger from '../../../../../core/utils/logger';

/**
 * Récupère les données de session en attente stockées par le checkout.
 * @returns {{ orderId: string, email: string } | null}
 */
const getPendingOrderSession = () => {
    try {
        const stored = sessionStorage.getItem('h1_pending_order');
        if (!stored) return null;

        const { orderId, email } = JSON.parse(stored);
        return orderId && email ? { orderId, email } : null;
    } catch {
        return null;
    }
};

/**
 * Normalise les données brutes d'une commande en enrichissant l'email
 * depuis toutes les sources disponibles (API > shippingAddress > session).
 *
 * @param {Object} orderData - Données brutes de l'API
 * @param {string} sessionEmail - Email de fallback depuis le sessionStorage
 * @returns {Object}
 */
const normalizeOrderInfo = (orderData, sessionEmail) => ({
    ...orderData,
    // Garantit que l'email est TOUJOURS présent pour le suivi invité
    email:
        orderData.email ||
        orderData.shippingAddress?.email ||
        orderData.shipping_address?.email ||
        sessionEmail,
    totalAmount: orderData.totalAmount || 0,
    items: orderData.items || [],
});

/**
 * Hook de vérification du résultat de paiement.
 * Poll l'état de la commande après retour de Stripe.
 */
export const usePaymentResult = () => {
    const [status, setStatus] = useState('loading');
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        const session = getPendingOrderSession();

        if (!session) {
            setStatus('error');
            return;
        }

        const { orderId, email } = session;

        let attempts = 0;
        const MAX_ATTEMPTS = 5;
        let timeoutId;

        const checkPaymentStatus = async () => {
            attempts++;
            try {
                const { data: statusData } = await api.get(`/payments/status/${orderId}`, {
                    params: { email },
                });

                const paymentStatus = statusData?.data?.paymentStatus;

                if (paymentStatus === 'PAID' || paymentStatus === 'SUCCESS') {
                    await fetchAndStoreOrder(orderId, email);
                    return;
                }

                if (attempts < MAX_ATTEMPTS) {
                    timeoutId = setTimeout(checkPaymentStatus, 2000);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                logger.error('[usePaymentResult] Polling error', error);

                if (error.response?.status === 403 || error.response?.status === 404) {
                    setStatus('error');
                } else if (attempts < MAX_ATTEMPTS) {
                    timeoutId = setTimeout(checkPaymentStatus, 2000);
                } else {
                    setStatus('error');
                }
            }
        };

        const fetchAndStoreOrder = async (orderId, sessionEmail) => {
            try {
                const { data: orderData } = await api.get(`/orders/${orderId}`, {
                    params: { email: sessionEmail },
                });

                const rawOrder = orderData?.data?.order;
                if (!rawOrder) throw new Error('Order not found');

                // BUG FIX : l'email du sessionStorage est propagé comme fallback
                setOrderInfo(normalizeOrderInfo(rawOrder, sessionEmail));
                setStatus('success');
                sessionStorage.removeItem('h1_pending_order');
            } catch (err) {
                logger.warn('[usePaymentResult] Order fetch warning, using fallback', err);
                // Fallback minimaliste — l'email de session est conservé
                setOrderInfo({ orderNumber: orderId, email: sessionEmail, status: 'PAID' });
                setStatus('success');
            }
        };

        checkPaymentStatus();
        return () => clearTimeout(timeoutId);
    }, []);

    return { status, orderInfo };
};