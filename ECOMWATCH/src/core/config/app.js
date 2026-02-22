/**
 * @module Config/App
 * Configuration technique globale (Settings).
 */
export const appConfig = {
    // Pagination & Affichage
    PAGINATION: {
        DEFAULT_LIMIT: 12,
        FEATURED_LIMIT: 4, // Vu dans product.service.js
    },

    // Prix (Limites pour les filtres)
    PRICE: {
        MIN: 0,
        MAX_DEFAULT: 100000, // Vu dans Catalogue.jsx
        STEP: 500, // Pour les segments de prix
    },

    // Gestion du Stock & Panier
    INVENTORY: {
        LOW_STOCK_THRESHOLD: 3, // Seuil pour afficher "Plus que X articles !"
        MAX_QUANTITY_PER_ITEM: 5,
    },

    // Délais & Timeouts (en millisecondes)
    TIMEOUTS: {
        API_REQUEST: 15000,
        DEBOUNCE_SEARCH: 500, // Délai de frappe barre de recherche
        TOAST_DURATION: 4000,
        REDIRECT_DELAY: 1500,
    },

    // Clés LocalStorage (CRUCIAL pour éviter les conflits)
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'ECOMWATCH_access_token',
        THEME: 'ECOMWATCH_theme',
        GUEST_CART: 'ECOMWATCH_guest_cart',
        GUEST_ORDERS: 'ECOMWATCH_guest_orders', // Vu dans useGuestOrders.js
    },

    // Formats
    FORMAT: {
        CURRENCY: 'EUR',
        LOCALE: 'fr-FR',
    },
};