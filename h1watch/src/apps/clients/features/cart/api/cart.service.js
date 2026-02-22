export const CartService = {
    calculateTotals: (items) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    },

    save: (items) => {
        try {
            localStorage.setItem('cart_storage_v1', JSON.stringify(items));
        } catch {
            // Échec silencieux si le stockage est saturé ou bloqué par le navigateur
        }
    },

    load: () => {
        try {
            const saved = localStorage.getItem('cart_storage_v1');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }
};