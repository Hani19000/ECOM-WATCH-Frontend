import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCart } from '../../cart/hooks/useCart';
import { checkoutService } from '../api/checkout.service';
import { CartBackupService } from '../../cart/api/Cartbackup.service';
import logger from '../../../../../core/utils/logger';
import toast from 'react-hot-toast';

/**
 * ─── CONSTANTES MÉTIER (Fallback Local) ──────────────────────────────────────
 * Définies en dehors du hook pour être accessibles partout (Preview & Options)
 */
const SHIPPING_RULES = {
    FRANCE: [
        { method: 'STANDARD', label: 'Livraison Standard', base: 5.90, perKg: 0.50, freeAbove: 50, days: '2-3' },
        { method: 'EXPRESS', label: 'Livraison Express', base: 9.90, perKg: 1.00, freeAbove: 100, days: '24h' },
        { method: 'RELAY', label: 'Point Relais', base: 3.90, perKg: 0.30, freeAbove: 40, days: '3-5' }
    ],
    EUROPE: [
        { method: 'STANDARD', label: 'Livraison Standard', base: 12.50, perKg: 1.50, freeAbove: 80, days: '5-7' },
        { method: 'EXPRESS', label: 'Livraison Express', base: 24.90, perKg: 3.00, freeAbove: 150, days: '2-3' }
    ],
    WORLD: [
        { method: 'STANDARD', label: 'Livraison Internationale', base: 19.90, perKg: 2.00, freeAbove: 200, days: '7-14' }
    ]
};

const COUNTRY_TO_ZONE = {
    'France': 'FRANCE',
    'Belgium': 'EUROPE',
    'Germany': 'EUROPE',
    'Spain': 'EUROPE',
    'Italy': 'EUROPE'
};

/**
 * Hook d'orchestration du Checkout.
 * Suit le "Service Layer Pattern" pour isoler la logique métier de la vue.
 */
export const useCheckout = () => {
    const { cart, totalPrice: cartTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [loadingPricing, setLoadingPricing] = useState(false);
    const [activeTaxRate, setActiveTaxRate] = useState(20);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        address: '', city: '', postalCode: '',
        country: 'France', phone: ''
    });

    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState('STANDARD');

    const cartWeight = useMemo(() => checkoutService.calculateTotalWeight(cart), [cart]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleShippingMethodChange = useCallback((method) => {
        setSelectedShippingMethod(method);
    }, []);

    const calculatePricingLocally = useCallback(() => {
        if (!cart.length) return null;

        const subtotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
        const zoneKey = COUNTRY_TO_ZONE[formData.country] || 'WORLD';
        const rules = SHIPPING_RULES[zoneKey] || SHIPPING_RULES.FRANCE;
        const rule = rules.find(r => r.method === selectedShippingMethod) || rules[0];

        const isFree = rule.freeAbove && subtotal >= rule.freeAbove;
        const shippingCost = isFree ? 0 : rule.base + (rule.perKg * cartWeight);
        const taxRate = activeTaxRate;
        const taxAmount = (subtotal * taxRate) / 100;

        return {
            subtotal: Number(subtotal.toFixed(2)),
            shipping: {
                cost: Number(shippingCost.toFixed(2)),
                isFree,
                method: rule.method,
                estimatedDays: rule.days
            },
            tax: { amount: Number(taxAmount.toFixed(2)), rate: taxRate },
            total: Number((subtotal + shippingCost + taxAmount).toFixed(2)),
            currency: 'EUR'
        };
    }, [cart, cartWeight, formData.country, selectedShippingMethod, activeTaxRate]);

    /**
     * Correction de la boucle infinie (React Error #185)
     * Remplacement du useState + useEffect par useMemo.
     * Le pricing est recalculé uniquement quand calculatePricingLocally change.
     */
    const pricing = useMemo(() => {
        const computedPricing = calculatePricingLocally();

        return computedPricing || {
            subtotal: 0,
            shipping: { cost: 0, isFree: false, method: 'STANDARD', estimatedDays: '2-3' },
            tax: { amount: 0, rate: 20 },
            total: 0,
            currency: 'EUR'
        };
    }, [calculatePricingLocally]);

    useEffect(() => {
        const updateTax = async () => {
            const localTaxDefaults = { 'France': 20, 'Belgium': 21, 'Germany': 19, 'Spain': 21, 'Italy': 22 };
            const rate = await checkoutService.fetchTaxRate(formData.country);
            setActiveTaxRate(rate || localTaxDefaults[formData.country] || 20);
        };
        updateTax();
    }, [formData.country]);

    useEffect(() => {
        let isMounted = true;

        const loadOptions = async () => {
            if (cart.length === 0) return;
            setLoadingPricing(true);

            try {
                const options = await checkoutService.fetchShippingOptions(formData.country, cartWeight, cartTotal);
                if (isMounted && options && options.length > 0) {
                    setShippingOptions(options);
                    setLoadingPricing(false);
                    return;
                }
            } catch (error) {
                if (error.response?.status !== 401) {
                    logger.debug("API Shipping inaccessible, passage en mode local.", error);
                }
            }

            if (isMounted) {
                const zoneKey = COUNTRY_TO_ZONE[formData.country] || 'WORLD';
                const rules = SHIPPING_RULES[zoneKey] || SHIPPING_RULES.FRANCE;

                const computedOptions = rules.map(rule => {
                    const isFree = rule.freeAbove && cartTotal >= rule.freeAbove;
                    return {
                        method: rule.method,
                        label: rule.label,
                        cost: isFree ? 0 : rule.base + (rule.perKg * cartWeight),
                        estimatedDays: rule.days,
                        isFree: isFree
                    };
                });

                setShippingOptions(computedOptions);
                setLoadingPricing(false);
            }
        };

        loadOptions();
        return () => { isMounted = false; };
    }, [formData.country, cart.length, cartWeight, cartTotal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            checkoutService.validateOrder(formData, cart);

            const response = await checkoutService.processOrder({
                customer: formData,
                shippingMethod: selectedShippingMethod,
                shippingCountry: formData.country,
                cartItems: cart
            });

            const { orderId, email } = response;
            sessionStorage.setItem('h1_pending_order', JSON.stringify({
                orderId,
                email: email?.trim().toLowerCase()
            }));

            CartBackupService.backup(cart);
            const checkoutUrl = await checkoutService.createPaymentSession(orderId);
            window.location.href = checkoutUrl;

        } catch (error) {
            toast.error(error.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData, handleInputChange,
        cart, shippingOptions,
        selectedShippingMethod, handleShippingMethodChange,
        pricing, loadingPricing, loading,
        handleSubmit
    };
};