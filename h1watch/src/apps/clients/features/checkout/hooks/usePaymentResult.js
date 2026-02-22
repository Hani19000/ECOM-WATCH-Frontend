import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
                            totalAmount: fullOrder.totalAmount || 0,
                            items: fullOrder.items || []
                        });

                        setStatus('success');
                        sessionStorage.removeItem('h1_pending_order');
                        return;

                    } catch (err) {
                        logger.warn('[usePaymentResult] Order fetch warning, using fallback', err);
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
                    setStatus('error');
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

/**
 * Hook pour annuler la commande et libérer le stock lors d'une annulation Stripe.
 *
 * Déclenchement : page `/checkout/cancel?orderId=<uuid>`
 *
 * Cas couverts :
 * 1. L'utilisateur clique "Annuler" sur la page Stripe → redirection immédiate
 * 2. L'utilisateur revient via le bouton "Retour" du navigateur depuis Stripe
 *
 * Cas NON couverts par ce hook (géré par le webhook Stripe) :
 * - Fermeture d'onglet sans retour → `checkout.session.expired` après ~30min
 *
 * Garantie d'idempotence :
 * - `hasCalled.current` empêche un double appel en React StrictMode (double-mount)
 * - Le backend gère lui aussi l'idempotence (commande déjà CANCELLED → no-op)
 */
export const usePaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const hasCalled = useRef(false);

    useEffect(() => {
        if (!orderId || hasCalled.current) return;
        hasCalled.current = true;

        const releaseStock = async () => {
            try {
                const stored = sessionStorage.getItem('h1_pending_order');
                const email = stored ? JSON.parse(stored)?.email ?? null : null;

                await api.post(`/orders/${orderId}/cancel`, { email });

                sessionStorage.removeItem('h1_pending_order');

                logger.info(`[usePaymentCancel] Stock libéré — orderId: ${orderId}`);

            } catch (error) {
                logger.warn('[usePaymentCancel] Libération du stock en attente des filets de sécurité', {
                    orderId,
                    httpStatus: error.response?.status,
                    message: error.message,
                });
            }
        };

        releaseStock();
    }, [orderId]);

    return { orderId };
};