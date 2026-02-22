export const CartService = {
    // Calculer le total pour éviter les erreurs de flottants
    calculateTotals: (items) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    },

    // Persister de manière fiable
    save: (items) => {
        localStorage.setItem('cart_storage_v1', JSON.stringify(items));
    },

    // Récupérer proprement
    load: () => {
        const saved = localStorage.getItem('cart_storage_v1');
        return saved ? JSON.parse(saved) : [];
    }
};