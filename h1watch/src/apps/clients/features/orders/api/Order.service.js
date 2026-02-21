/**
 * @module OrderService (Frontend)
 *
 * Service Layer pour la communication avec l'API commandes.
 *
 * RESPONSABILITÉS :
 * - Appels HTTP vers l'API backend (GET, POST /claim)
 * - Coordination entre la réponse API et le cache local (GuestOrderService)
 *
 * COHÉRENCE ÉTAT SERVEUR / ÉTAT LOCAL :
 * Après un claim (manuel ou auto), le serveur déplace la commande
 * du périmètre public (user_id IS NULL) vers le périmètre privé.
 * Ce service s'assure que le localStorage reflète ce changement
 * en appelant GuestOrderService.syncWithClaimed() avec les numéros
 * de commandes transférées retournés par le serveur.
 */
import { api } from '../../../api/axios.config';
import { GuestOrderService } from './GuestOrder.service';

export const OrderService = {

    // ─────────────────────────────────────────────────────────────────────
    // LECTURE
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Récupère les détails complets d'une commande (mode guest ou authentifié).
     *
     * MODE GUEST : passer l'email en paramètre → GET /orders/:id?email=xxx
     * MODE AUTH  : ne pas passer l'email → le token Bearer fait foi
     *
     * @param {string} orderId - UUID de la commande
     * @param {string|null} email - Email du client (requis uniquement en mode guest)
     * @returns {Promise<Object>} Détails de la commande
     */
    /**
     * Récupère les détails complets d'une commande
     */
    async getOrderDetails(orderId, email = null) {
        try {
            const { data } = await api.get(`/orders/${orderId}`, {
                params: email ? { email: email.trim().toLowerCase() } : {}
            });

            // FIX : Si data.data.order n'existe pas, on prend data.data (le backend renvoie parfois l'objet direct)
            const orderData = data.data?.order || data.data;

            // On s'assure que les items sont bien présents
            if (orderData && !orderData.items && orderData.OrderItems) {
                orderData.items = orderData.OrderItems;
            }

            return orderData;
        } catch (error) {
            console.error('[OrderService] Erreur récupération commande :', error);
            throw error;
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // CLAIM — RATTACHEMENT MANUEL
    // ─────────────────────────────────────────────────────────────────────

    /**
     * 🔄 RATTACHEMENT MANUEL D'UNE COMMANDE GUEST
     *
     * Appelle l'API pour transférer la propriété de la commande,
     * puis synchronise le localStorage pour retirer la commande
     * du suivi public local.
     *
     * POURQUOI LA SYNCHRONISATION LOCALE :
     * Le serveur rend la commande invisible côté API dès que user_id != null.
     * Mais le localStorage conserve encore l'entrée — l'UI afficherait
     * une commande que le serveur refuserait de retourner (404 pour les guests).
     * La synchronisation évite cette incohérence.
     *
     * @param {string} orderId           - UUID de la commande à rattacher
     * @param {string} verificationEmail - Email de vérification (doit correspondre à la commande)
     * @returns {Promise<Object>} Commande rattachée (avec user_id renseigné)
     * @throws {Error} Si le claim échoue (email incorrect, commande déjà rattachée, etc.)
     */
    async claimOrder(orderId, verificationEmail) {
        try {
            const { data } = await api.post(`/orders/${orderId}/claim`, {
                email: verificationEmail.trim().toLowerCase()
            });

            const claimedOrder = data.data.order;

            // Synchronisation immédiate du localStorage :
            // la commande n'est plus dans le périmètre guest côté serveur
            // (user_id != null → invisible pour findGuestOnlyById).
            // On la retire du suivi local pour que l'UI soit cohérente.
            if (claimedOrder?.orderNumber) {
                GuestOrderService.syncWithClaimed([claimedOrder.orderNumber]);
            }

            return claimedOrder;
        } catch (error) {
            console.error('[OrderService] Erreur rattachement commande :', error);
            throw error;
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // FORMATAGE
    // ─────────────────────────────────────────────────────────────────────

    /**
     * Formate les données brutes de l'API pour le stockage local.
     * Utilisé après un checkout guest pour enregistrer la commande
     * dans le localStorage via GuestOrderService.addOrder().
     *
     * @param {Object} orderData - Données brutes retournées par l'API
     * @returns {Object} Données normalisées pour GuestOrderService
     */
    formatForLocalStorage(orderData) {
        return {
            id: orderData.id,
            orderNumber: orderData.orderNumber,
            status: orderData.status || 'PAID',
            totalAmount: orderData.totalAmount,
            createdAt: orderData.createdAt || new Date().toISOString(),
            items: orderData.items || [],
            email: orderData.shippingAddress?.email ?? null
        };
    }
};