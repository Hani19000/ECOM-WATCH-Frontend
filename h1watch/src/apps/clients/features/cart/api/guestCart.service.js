import { appConfig } from '../../../core/config/app';

const STORAGE_KEY = appConfig.STORAGE_KEYS.GUEST_CART || 'h1watch_guest_cart';

/**
 * Service gérant la persistance du panier "Invité" dans le navigateur.
 */
export const GuestCartService = {
    getCart() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    },

    /**
     * Sauvegarde l'état complet du panier.
     * @param {Array} items - Liste des items.
     */
    saveCart(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        // Dispatch event pour synchronisation multi-onglets/composants
        window.dispatchEvent(new Event('cartUpdated'));
    },

    /**
     * Ajoute un item ou incrémente sa quantité s'il existe déjà.
     * Gestion fine des variants pour éviter les doublons incorrects.
     */
    addItem(product, quantity, variant = null) {
        const items = this.getCart();
        // Création d'un ID unique composite pour identifier la ligne
        const variantId = variant?.id || variant?._id || null;
        const lineId = `${product._id}-${variantId || 'base'}`;

        const existingIndex = items.findIndex(item =>
            item.productId === product._id &&
            ((!item.variant && !variant) || (item.variant?.id === variantId))
        );

        if (existingIndex > -1) {
            items[existingIndex].quantity += quantity;
        } else {
            items.push({
                lineId, // ID temporaire pour le frontend
                productId: product._id,
                product: product, // On stocke tout l'objet pour l'affichage sans appel API
                variant,
                quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart(items);
        return items;
    },

    updateItem(lineId, quantity) {
        let items = this.getCart();
        if (quantity <= 0) {
            items = items.filter(item => item.lineId !== lineId);
        } else {
            items = items.map(item =>
                item.lineId === lineId ? { ...item, quantity } : item
            );
        }
        this.saveCart(items);
        return items;
    },

    removeItem(lineId) {
        const items = this.getCart().filter(item => item.lineId !== lineId);
        this.saveCart(items);
        return items;
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event('cartUpdated'));
    }
};