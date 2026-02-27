import api from "../../../../../api/axios.config";
import logger from "../../../../../core/utils/logger";

/**
 * Service Layer Pattern
 * Isole la logique de calcul et les appels API pour la commande.
 */
export const checkoutService = {
    validateOrder: (formData, cartItems) => {
        if (!cartItems || cartItems.length === 0) throw new Error("Votre panier est vide.");

        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode', 'country'];
        const missingFields = requiredFields.filter(field => {
            const value = formData[field];
            return !value || (typeof value === 'string' && value.trim() === '');
        });

        if (missingFields.length > 0) {
            const fieldNames = { firstName: 'Prénom', lastName: 'Nom', email: 'Email', address: 'Adresse', city: 'Ville', postalCode: 'Code postal', country: 'Pays' };
            throw new Error(`Champs manquants : ${missingFields.map(f => fieldNames[f] || f).join(', ')}`);
        }

        const email = formData.email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.includes(' ')) {
            throw new Error("Le format de l'email est invalide.");
        }

        return true;
    },

    async fetchShippingOptions(country, totalWeight, cartSubtotal) {
        try {
            const response = await api.post('/shipping/calculate', { country, totalWeight, cartSubtotal });
            return response.data.data.options;
        } catch (error) {
            if (error.response?.status === 401) {
                // Route protégée : user guest ou token expiré
                // On retourne null → useCheckout bascule sur le calcul local
                logger.debug('[Shipping] Route protégée, fallback local activé.');
                return null; // ← Ne plus throw
            }
            throw error; // Propager seulement les vraies erreurs (500, réseau, etc.)
        }
    },

    previewOrderTotal: async (shippingMethod = 'STANDARD', shippingCountry = 'France', taxCategory = 'standard') => {
        try {
            const response = await api.post('/orders/preview', { shippingMethod, shippingCountry, taxCategory });
            return response.data.data.preview;
        } catch {
            throw new Error("Impossible de calculer le montant total. Veuillez réessayer.");
        }
    },

    processOrder: async (orderData) => {
        try {
            const items = orderData.cartItems.map(item => ({
                variantId: item.variantId,
                productName: item.name,
                variantAttributes: { color: item.color || null, size: item.size || null },
                price: item.price,
                quantity: item.quantity,
                weight: item.weight || null,
            }));

            const shippingAddress = {
                firstName: orderData.customer.firstName?.trim() || '',
                lastName: orderData.customer.lastName?.trim() || '',
                street: orderData.customer.address?.trim() || '',
                city: orderData.customer.city?.trim() || '',
                zipCode: orderData.customer.postalCode?.trim() || '',
                country: orderData.customer.country?.trim() || 'France',
                phone: orderData.customer.phone?.trim() || null,
                email: orderData.customer.email?.trim().toLowerCase() || '',
            };

            const response = await api.post('/orders/checkout', {
                items, shippingAddress,
                shippingMethod: orderData.shippingMethod,
                shippingCountry: orderData.shippingCountry,
                taxCategory: orderData.taxCategory || 'standard'
            });

            return {
                success: true,
                orderId: response.data?.data?.order?.id,
                email: shippingAddress.email,
                order: response.data?.data?.order,
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || "Échec du paiement. Veuillez réessayer.");
        }
    },

    createPaymentSession: async (orderId) => {
        try {
            const response = await api.post(`/payments/create-session/${orderId}`, { provider: 'STRIPE' });
            return response.data.data.checkoutUrl;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Impossible d'initier le paiement. Veuillez réessayer.");
        }
    },

    calculateTotalWeight: (cartItems) => {
        return cartItems.reduce((total, item) => total + (Number(item.weight || 0.5) * item.quantity), 0);
    },

    async fetchTaxRate(country) {
        try {
            const response = await api.get(`/taxes/rates/${country}`);
            return response.data.data.rates.standard || 20;
        } catch {
            logger.warn("Échec récupération taxe, usage du taux par défaut");
            return 20;
        }
    }
};