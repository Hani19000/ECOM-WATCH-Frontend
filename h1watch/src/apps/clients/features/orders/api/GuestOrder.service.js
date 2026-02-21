/**
 * @module GuestOrderService
 *
 * ─── CORRECTIONS ──────────────────────────────────────────────────────────────
 *
 * BUG 1 — "commandes toujours visibles après inscription"
 * CAUSE : `window.addEventListener('storage', ...)` ne se déclenche pas dans
 * le même onglet. useGuestOrders restait figé sur les anciennes commandes.
 * FIX : Chaque écriture dispatch un CustomEvent('guestOrdersChanged').
 * useGuestOrders écoute cet événement (même onglet) + 'storage' (autres onglets).
 *
 * BUG 2 — "double commande dont une à 0€"
 * CAUSE : Le checkout frontend appelait GuestOrderService.addOrder() avec la
 * réponse brute du serveur (statut PENDING, totalAmount = 0) avant confirmation
 * du paiement Stripe. Le webhook Stripe créait ensuite la vraie commande avec
 * le bon montant et orderNumber, résultant en deux entrées dans le localStorage.
 * FIX : addOrder() refuse les commandes en statut PENDING ou avec un montant nul.
 * La sauvegarde locale ne doit se faire qu'après confirmation de paiement,
 * quand le serveur retourne statut PAID avec un totalAmount > 0.
 *
 * CONTRAT D'USAGE (côté checkout frontend) :
 * N'appeler addOrder() qu'après la confirmation de paiement :
 *   - Après redirection depuis Stripe (success_url)
 *   - OU après réception du webhook côté client (polling sur /orders/:id)
 *   - JAMAIS immédiatement après POST /checkout (commande encore PENDING)
 */

const CONFIG = {
    STORAGE_KEY: 'h1_guest_orders',
    MAX_AGE_DAYS: 30,
    MAX_ORDERS_LIMIT: 10,
    CHANGE_EVENT: 'guestOrdersChanged',
};

// Statuts qui indiquent une commande confirmée et payée — les seuls qu'on persiste.
// PENDING est exclu : le paiement n'est pas encore confirmé, totalAmount peut être 0.
const PERSISTED_STATUSES = new Set(['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']);

// ─── Utilitaires privés ────────────────────────────────────────────────────────

const safeParse = (str) => {
    if (!str) return [];
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const isExpired = (dateString) => {
    try {
        const ms = new Date(dateString).getTime();
        if (isNaN(ms)) return true;
        return (Date.now() - ms) / (1000 * 60 * 60 * 24) > CONFIG.MAX_AGE_DAYS;
    } catch {
        return true;
    }
};

const normalize = (order) => ({
    id: order.id || crypto.randomUUID(),
    orderNumber: order.orderNumber,
    status: order.status || 'PAID',
    totalAmount: Number(order.totalAmount) || 0,
    items: Array.isArray(order.items) ? order.items : [],
    createdAt: order.createdAt || new Date().toISOString(),
    email: order.email || order.shippingAddress?.email || order.shipping_address?.email || null,
});

// ─── Service public ────────────────────────────────────────────────────────────

export const GuestOrderService = {

    getOrders() {
        try {
            const all = safeParse(localStorage.getItem(CONFIG.STORAGE_KEY));
            if (!all.length) return [];

            const valid = all.filter(o => o?.orderNumber && o?.createdAt && !isExpired(o.createdAt));

            if (valid.length !== all.length) {
                // Nettoyage silencieux des commandes expirées (pas de dispatch pour éviter les boucles)
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(valid));
            }

            return valid.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch {
            return [];
        }
    },

    /**
     * Persiste une commande dans le localStorage.
     *
     * GARDE : Refuse les commandes PENDING ou à montant nul.
     * N'appeler cette méthode qu'après confirmation de paiement (statut PAID+).
     * Appeler sur une commande PENDING (réponse directe du checkout) résulterait
     * en une entrée fantôme à 0€ qui coexiste avec la commande réelle une fois
     * le webhook Stripe traité.
     *
     * @param {Object} orderInfo - Données normalisées (via OrderService.formatForLocalStorage)
     * @returns {boolean} true si sauvegardé, false si rejeté ou en erreur
     */
    addOrder(orderInfo) {
        if (!orderInfo?.orderNumber) return false;

        // Refus explicite des commandes non confirmées — voir JSDoc ci-dessus
        if (!PERSISTED_STATUSES.has(orderInfo.status)) {
            console.warn(
                `[GuestOrderService] addOrder ignoré : statut "${orderInfo.status}" non persistable.`,
                'Appelez addOrder uniquement après confirmation du paiement (statut PAID+).'
            );
            return false;
        }

        if (!orderInfo.totalAmount || Number(orderInfo.totalAmount) <= 0) {
            console.warn('[GuestOrderService] addOrder ignoré : totalAmount nul ou absent.');
            return false;
        }

        try {
            const current = this.getOrders();
            const norm = normalize(orderInfo);
            // Déduplique par orderNumber : si la commande existe déjà, on la remplace
            // (cas de mise à jour de statut après un polling de confirmation)
            const others = current.filter(o => o.orderNumber !== norm.orderNumber);
            this._save([norm, ...others].slice(0, CONFIG.MAX_ORDERS_LIMIT));
            return true;
        } catch {
            return false;
        }
    },

    removeOrder(identifier) {
        if (!identifier) return false;
        try {
            const current = this.getOrders();
            const filtered = current.filter(o => o.id !== identifier && o.orderNumber !== identifier);
            if (filtered.length === current.length) return false;
            this._save(filtered);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Retire du localStorage les commandes rattachées au compte.
     *
     * Appelé avec la liste `claimedOrderNumbers` retournée par le serveur
     * après register() ou claimOrder(). Dispatch guestOrdersChanged
     * pour que useGuestOrders se rafraîchisse immédiatement dans le même onglet.
     *
     * @param {string[]} orderNumbers - Numéros de commandes rattachées (ex: ['ORD-2026-123456'])
     */
    syncWithClaimed(orderNumbers) {
        if (!Array.isArray(orderNumbers) || !orderNumbers.length) return { purged: 0 };

        const claimedSet = new Set(orderNumbers.map(n => String(n).trim().toUpperCase()));
        const current = this.getOrders();
        const kept = current.filter(o => !claimedSet.has(String(o.orderNumber).trim().toUpperCase()));
        const purged = current.length - kept.length;

        if (purged > 0) {
            this._save(kept);
            console.debug(`[GuestOrderService] ${purged} commande(s) rattachée(s) retirée(s) du suivi local.`);
        }

        return { purged, remaining: kept.length };
    },

    hasOrder: (num) => GuestOrderService.getOrders().some(o => o.orderNumber === num),

    getOrderByNumber: (num) => GuestOrderService.getOrders().find(o => o.orderNumber === num) ?? null,

    clearAll() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(CONFIG.CHANGE_EVENT));
    },

    /** @private — Écrit et notifie le même onglet. */
    _save(data) {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent(CONFIG.CHANGE_EVENT));
    },
};