import { useState, useEffect } from 'react';
import api from '../../../../../api/axios.config';
import logger from '../../../../../core/utils/logger';

/**
 * Hook de vérification du résultat de paiement.
 * Gère le polling de l'état de la commande après retour de Stripe.
 */
export const usePaymentResult = () => {
    const [status, setStatus] = useState('loading');
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('h1_pending_order');
        if (!stored) {
            setStatus('error');
            return;
        }

        let orderId, email;
        try {
            const data = JSON.parse(stored);
            orderId = data.orderId;
            email = data.email;
        } catch (e) {
            logger.error('[usePaymentResult] Parse error', e);
            setStatus('error');
            return;
        }

        if (!orderId || !email) {
            setStatus('error');
            return;
        }

        let attempts = 0;
        const MAX_ATTEMPTS = 5;
        let timeoutId;

        const checkPaymentStatus = async () => {
            attempts++;
            try {
                // 1. Vérification Statut Paiement
                const { data: statusData } = await api.get(`/payments/status/${orderId}`, {
                    params: { email }
                });

                const paymentStatus = statusData?.data?.paymentStatus;

                if (paymentStatus === 'PAID' || paymentStatus === 'SUCCESS') {
                    // 2. Récupération Détails Commande
                    try {
                        const { data: orderData } = await api.get(`/orders/${orderId}`, {
                            params: { email }
                        });

                        const fullOrder = orderData?.data?.order;
                        if (!fullOrder) throw new Error("Order not found");

                        setOrderInfo({
                            ...fullOrder,
                            // Normalisation pour l'affichage
                            totalAmount: fullOrder.totalAmount || 0,
                            items: fullOrder.items || []
                        });

                        setStatus('success');
                        sessionStorage.removeItem('h1_pending_order');
                        return; // Stop polling

                    } catch (err) {
                        logger.warn('[usePaymentResult] Order fetch warning, using fallback', err);
                        // Fallback minimaliste
                        setOrderInfo({ orderNumber: orderId, email, status: 'PAID' });
                        setStatus('success');
                        return;
                    }
                }

                // Retry logic
                if (attempts < MAX_ATTEMPTS) {
                    timeoutId = setTimeout(checkPaymentStatus, 2000);
                } else {
                    setStatus('error');
                }

            } catch (error) {
                logger.error('[usePaymentResult] Polling error', error);
                if (error.response?.status === 403 || error.response?.status === 404) {
                    setStatus('error'); // Erreur fatale
                } else if (attempts < MAX_ATTEMPTS) {
                    timeoutId = setTimeout(checkPaymentStatus, 2000);
                } else {
                    setStatus('error');
                }
            }
        };

        checkPaymentStatus();

        return () => clearTimeout(timeoutId);
    }, []);

    return { status, orderInfo };
};