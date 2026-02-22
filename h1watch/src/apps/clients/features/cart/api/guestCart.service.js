import { appConfig } from "../../../../../core/config/app";

const STORAGE_KEY = appConfig.STORAGE_KEYS.GUEST_CART || 'h1watch_guest_cart';

/**
 * Service dédié au panier non-authentifié.
 * Émet des événements globaux pour synchroniser les différents onglets du navigateur.
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

    saveCart(items) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch {
            // Fail-safe
        }
    },

    addItem(product, quantity, variant = null) {
        const items = this.getCart();
        const variantId = variant?.id || variant?._id || null;
        const lineId = `${product._id}-${variantId || 'base'}`;

        const existingItem = items.find(item =>
            item.productId === product._id &&
            ((!item.variant && !variant) || (item.variant?.id === variantId))
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({
                lineId,
                productId: product._id,
                product,
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
            items = items.map(item => item.lineId === lineId ? { ...item, quantity } : item);
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
        try {
            localStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch {
            // Fail-safe
        }
    }
};