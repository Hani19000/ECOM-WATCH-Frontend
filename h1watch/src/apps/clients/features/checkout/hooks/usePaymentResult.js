import { useState, useEffect } from 'react';
import api from '../../../../../api/axios.config';
import logger from '../../../../../core/utils/logger';

/**
 * Nombre maximum de tentatives de polling avant d'abandonner.
 * Couvre les délais de traitement webhook Stripe (généralement < 5 secondes).
 */
const MAX_POLLING_ATTEMPTS = 5;
const POLLING_INTERVAL_MS = 2000;

/**
 * Statuts Stripe considérés comme un paiement confirmé.
 * "SUCCESS" est conservé comme alias pour compatibilité avec d'éventuelles
 * implémentations alternatives de passerelle de paiement.
 */
const CONFIRMED_PAYMENT_STATUSES = new Set(['PAID', 'SUCCESS']);

/**
 * Extrait et valide les données de session de paiement en attente
 * depuis le sessionStorage.
 *
 * Ces données sont écrites au moment du checkout, juste avant la
 * redirection vers Stripe, pour pouvoir identifier la commande au retour.
 *
 * @returns {{ orderId: string, email: string } | null}
 */
const readPendingOrderSession = () => {
    const raw = sessionStorage.getItem('h1_pending_order');
    if (!raw) return null;

    try {
        const { orderId, email } = JSON.parse(raw);
        if (!orderId || !email) return null;
        return { orderId, email };
    } catch {
        logger.error('[usePaymentResult] Données de session corrompues, impossible de vérifier le paiement.');
        return null;
    }
};

/**
 * Récupère les détails complets d'une commande après confirmation du paiement.
 * En cas d'échec (indisponibilité temporaire de l'API), un objet minimal
 * est retourné pour ne pas bloquer l'affichage de la page de succès.
 *
 * @param {string} orderId
 * @param {string} email - Requis en mode guest comme second facteur d'authentification
 * @returns {Promise<Object>}
 */
const fetchOrderDetails = async (orderId, email) => {
    try {
        const { data } = await api.get(`/orders/${orderId}`, { params: { email } });

        const order = data?.data?.order;
        if (!order) throw new Error('Format de réponse inattendu : champ order absent.');

        return {
            ...order,
            totalAmount: order.totalAmount || 0,
            items: order.items || [],
        };
    } catch (err) {
        logger.warn(
            '[usePaymentResult] Récupération des détails de commande échouée. ' +
            'Affichage en mode dégradé (données minimales).',
            err
        );
        // Fallback minimal : la page de succès peut s'afficher sans le détail complet
        return { orderNumber: orderId, email, status: 'PAID' };
    }
};

/**
 * Vérifie le statut du paiement via polling après retour de Stripe.
 *
 * Contexte : Stripe redirige l'utilisateur vers /checkout/success immédiatement
 * après la saisie de la carte, mais le webhook de confirmation (checkout.session.completed)
 * peut arriver avec un léger délai. Le polling permet de ne pas afficher
 * un état d'erreur prématuré si le webhook n'a pas encore été traité.
 *
 * Stratégie d'arrêt :
 * - Succès dès que le statut passe à PAID / SUCCESS
 * - Erreur après MAX_POLLING_ATTEMPTS tentatives sans confirmation
 * - Erreur immédiate sur 403 / 404 (commande inexistante ou accès refusé)
 *
 * @returns {{ status: 'loading' | 'success' | 'error', orderInfo: Object | null }}
 */
export const usePaymentResult = () => {
    const [status, setStatus] = useState('loading');
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        const session = readPendingOrderSession();

        if (!session) {
            setStatus('error');
            return;
        }

        const { orderId, email } = session;

        let attempts = 0;
        let timeoutId;

        const pollPaymentStatus = async () => {
            attempts++;

            try {
                const { data } = await api.get(`/payments/status/${orderId}`, {
                    params: { email },
                });

                const paymentStatus = data?.data?.paymentStatus;

                if (CONFIRMED_PAYMENT_STATUSES.has(paymentStatus)) {
                    const order = await fetchOrderDetails(orderId, email);
                    setOrderInfo(order);
                    setStatus('success');
                    sessionStorage.removeItem('h1_pending_order');
                    return;
                }

                // Le paiement n'est pas encore confirmé côté backend : on réessaie
                if (attempts < MAX_POLLING_ATTEMPTS) {
                    timeoutId = setTimeout(pollPaymentStatus, POLLING_INTERVAL_MS);
                } else {
                    logger.warn(`[usePaymentResult] Paiement non confirmé après ${MAX_POLLING_ATTEMPTS} tentatives.`);
                    setStatus('error');
                }

            } catch (error) {
                const httpStatus = error.response?.status;

                // Erreurs définitives : inutile de réessayer
                if (httpStatus === 403 || httpStatus === 404) {
                    logger.error('[usePaymentResult] Accès refusé ou commande introuvable.', { orderId, httpStatus });
                    setStatus('error');
                    return;
                }

                // Erreurs réseau ou serveur transitoires : on réessaie si possible
                if (attempts < MAX_POLLING_ATTEMPTS) {
                    timeoutId = setTimeout(pollPaymentStatus, POLLING_INTERVAL_MS);
                } else {
                    logger.error('[usePaymentResult] Échec du polling après plusieurs tentatives.', error);
                    setStatus('error');
                }
            }
        };

        pollPaymentStatus();

        return () => clearTimeout(timeoutId);
    }, []);

    return { status, orderInfo };
};