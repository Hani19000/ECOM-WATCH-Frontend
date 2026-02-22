/**
 * @module Constants/OrderStatus
 * 
 * CENTRALISATION DES STATUTS DE COMMANDE
 * 
 * POURQUOI CE FICHIER :
 * - Source de vérité unique (Single Source of Truth)
 * - Évite les typos et incohérences
 * - Facilite les changements futurs
 * - Permet la validation TypeScript
 */

/**
 * ENUM : Statuts de commande
 * 
 * WORKFLOW STANDARD :
 * PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
 * 
 * BRANCHES ALTERNATIVES :
 * - Annulation : PENDING → CANCELLED
 * - Remboursement : PAID/PROCESSING/SHIPPED → REFUNDED
 */
export const ORDER_STATUS = Object.freeze({
    /**
     * Commande créée, en attente de paiement
     * - Stock réservé
     * - Paiement non confirmé
     * - Expire après 24h sans paiement
     */
    PENDING: 'PENDING',

    /**
     * Paiement validé et confirmé
     * - Webhook Stripe reçu
     * - Fonds capturés
     * - Prêt pour préparation
     */
    PAID: 'PAID',

    /**
     * Commande en cours de préparation
     * - Picking en entrepôt
     * - Emballage
     * - Prêt pour expédition
     */
    PROCESSING: 'PROCESSING',

    /**
     * Commande expédiée
     * - Tracking disponible
     * - En transit chez transporteur
     * - Notifications envoyées
     */
    SHIPPED: 'SHIPPED',

    /**
     * Commande livrée avec succès
     * - Confirmée par transporteur
     * - Stock définitivement débité
     * - Commande finalisée
     */
    DELIVERED: 'DELIVERED',

    /**
     * Commande annulée
     * - Avant expédition uniquement
     * - Stock libéré
     * - Remboursement si paiement validé
     */
    CANCELLED: 'CANCELLED',

    /**
     * Commande remboursée
     * - Retour accepté
     * - Fonds restitués
     * - Stock réintégré
     */
    REFUNDED: 'REFUNDED',
});

/**
 * Liste ordonnée des statuts (pour progression)
 * Utilisé pour les barres de progression et validations
 */
export const ORDER_STATUS_FLOW = Object.freeze([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PAID,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
]);

/**
 * Statuts considérés comme "actifs" (commande en cours)
 * Utilisé pour les compteurs "Commandes en cours"
 */
export const ACTIVE_ORDER_STATUSES = Object.freeze([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PAID,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
]);

/**
 * Statuts considérés comme "terminés" (finalisés)
 * Utilisé pour les statistiques de complétion
 */
export const COMPLETED_ORDER_STATUSES = Object.freeze([
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.REFUNDED,
]);

/**
 * Statuts permettant l'annulation
 * Seules les commandes non expédiées peuvent être annulées
 */
export const CANCELLABLE_STATUSES = Object.freeze([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PAID,
    ORDER_STATUS.PROCESSING,
]);

/**
 * Statuts permettant le remboursement
 * Commandes payées mais pas encore livrées
 */
export const REFUNDABLE_STATUSES = Object.freeze([
    ORDER_STATUS.PAID,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED, // Retour possible après livraison
]);

/**
 * Vérifie si un statut est valide
 * 
 * @param {string} status - Statut à valider
 * @returns {boolean} True si le statut existe
 */
export function isValidStatus(status) {
    return Object.values(ORDER_STATUS).includes(status);
}

/**
 * Obtient le statut suivant dans le workflow
 * 
 * @param {string} currentStatus - Statut actuel
 * @returns {string|null} Statut suivant ou null si dernier
 */
export function getNextStatus(currentStatus) {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);

    if (currentIndex === -1 || currentIndex === ORDER_STATUS_FLOW.length - 1) {
        return null;
    }

    return ORDER_STATUS_FLOW[currentIndex + 1];
}

/**
 * Vérifie si une transition de statut est valide
 * 
 * @param {string} fromStatus - Statut actuel
 * @param {string} toStatus - Statut cible
 * @returns {boolean} True si la transition est autorisée
 */
export function isValidTransition(fromStatus, toStatus) {
    // Vérifier que les deux statuts existent
    if (!isValidStatus(fromStatus) || !isValidStatus(toStatus)) {
        return false;
    }

    // Transitions toujours autorisées (rétrogrades)
    const alwaysAllowed = [
        [ORDER_STATUS.PAID, ORDER_STATUS.REFUNDED],
        [ORDER_STATUS.PROCESSING, ORDER_STATUS.REFUNDED],
        [ORDER_STATUS.SHIPPED, ORDER_STATUS.REFUNDED],
        [ORDER_STATUS.DELIVERED, ORDER_STATUS.REFUNDED],
        [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELLED],
        [ORDER_STATUS.PAID, ORDER_STATUS.CANCELLED],
        [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
    ];

    for (const [from, to] of alwaysAllowed) {
        if (fromStatus === from && toStatus === to) {
            return true;
        }
    }

    // Transition progressive (suivre le workflow)
    const fromIndex = ORDER_STATUS_FLOW.indexOf(fromStatus);
    const toIndex = ORDER_STATUS_FLOW.indexOf(toStatus);

    // Autoriser uniquement progression d'une étape
    return toIndex === fromIndex + 1;
}

/**
 * Calcule le pourcentage de progression
 * 
 * @param {string} status - Statut actuel
 * @returns {number} Pourcentage (0-100)
 */
export function getProgressPercentage(status) {
    const index = ORDER_STATUS_FLOW.indexOf(status);

    if (index === -1) return 0;

    return Math.round((index / (ORDER_STATUS_FLOW.length - 1)) * 100);
}

/**
 * Labels français pour l'affichage
 * Utilisé dans les composants UI
 */
export const ORDER_STATUS_LABELS = Object.freeze({
    [ORDER_STATUS.PENDING]: 'En attente',
    [ORDER_STATUS.PAID]: 'Payée',
    [ORDER_STATUS.PROCESSING]: 'Préparation',
    [ORDER_STATUS.SHIPPED]: 'Expédiée',
    [ORDER_STATUS.DELIVERED]: 'Livrée',
    [ORDER_STATUS.CANCELLED]: 'Annulée',
    [ORDER_STATUS.REFUNDED]: 'Remboursée',
});

/**
 * Couleurs Tailwind pour l'affichage
 * Utilisé dans les badges de statut
 */
export const ORDER_STATUS_COLORS = Object.freeze({
    [ORDER_STATUS.PENDING]: 'yellow',
    [ORDER_STATUS.PAID]: 'blue',
    [ORDER_STATUS.PROCESSING]: 'purple',
    [ORDER_STATUS.SHIPPED]: 'indigo',
    [ORDER_STATUS.DELIVERED]: 'green',
    [ORDER_STATUS.CANCELLED]: 'red',
    [ORDER_STATUS.REFUNDED]: 'gray',
});