import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ProductService from '../../products/api/product.service';
import logger from '../../../../../core/utils/logger';
import toast from 'react-hot-toast';

export const useCartLogic = (cartKey) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(cartKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            logger.error("[useCartLogic] Restore failed", error);
            return [];
        }
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Garde une référence synchronisée pour l'utiliser dans les callbacks 
    // sans provoquer de re-rendus ou de boucles infinies.
    const cartRef = useRef(cart);
    const initialValidationDone = useRef(false);

    useEffect(() => {
        cartRef.current = cart;
        try {
            localStorage.setItem(cartKey, JSON.stringify(cart));
        } catch {
            // Ignoré si quota dépassé
        }
    }, [cart, cartKey]);

    /*
     * Interroge le backend pour vérifier la validité des stocks actuels.
     * Met à jour les quantités du panier si un produit est tombé en rupture entre temps.
     */
    const validateCart = useCallback(async () => {
        const currentCart = cartRef.current;
        if (!currentCart?.length) return true;

        const variantIds = currentCart.map(item => item.variantId).filter(Boolean);
        if (!variantIds.length) return true;

        try {
            const { stockMap } = await ProductService.validateVariants(variantIds);
            let isValid = true;
            let removedNames = [];

            setCart(prev => {
                const updatedCart = [];

                for (const item of prev) {
                    if (!item.variantId) continue;

                    const availableStock = stockMap[item.variantId];

                    // Produit n'existe plus en base
                    if (availableStock === undefined) {
                        removedNames.push(item.name);
                        isValid = false;
                        continue;
                    }

                    if (availableStock === 0 || availableStock < item.quantity) {
                        isValid = false;
                    }

                    updatedCart.push({
                        ...item,
                        isOutOfStock: availableStock === 0,
                        availableStock,
                        quantity: Math.min(item.quantity, availableStock || 1),
                    });
                }

                return updatedCart;
            });

            if (removedNames.length > 0) {
                toast.error(`Articles retirés (plus disponibles) : ${removedNames.join(', ')}`, { id: 'cart-validation' });
            }
            return isValid;

        } catch (error) {
            // Fail-open : si l'API échoue, on ne vide pas le panier du client.
            logger.error("[useCartLogic] Validation API échouée", error);
            return true;
        }
    }, []);

    const addToCart = useCallback((product, variant, qty = 1) => {
        const quantityToAdd = Number(qty);
        const currentCart = cartRef.current;
        const existingIndex = currentCart.findIndex(item => item.variantId === variant.id);
        const availableStock = variant.inventory?.availableStock ?? 0;

        if (existingIndex !== -1) {
            const currentItem = currentCart[existingIndex];
            const currentStock = currentItem.availableStock ?? availableStock;

            if (currentItem.quantity + quantityToAdd > currentStock) {
                return { success: false, reason: 'out_of_stock' };
            }
        } else if (quantityToAdd > availableStock) {
            return { success: false, reason: 'out_of_stock' };
        }

        setCart(prev => {
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantityToAdd;
                return updated;
            }

            const originalPrice = variant.price;
            const promotion = variant.promotion ?? null;
            const effectivePrice = promotion?.discountedPrice ?? originalPrice;

            return [...prev, {
                variantId: variant.id,
                name: product.name,
                price: effectivePrice,
                originalPrice: promotion ? originalPrice : null,
                promotion: promotion ? { discountType: promotion.discountType, discountValue: promotion.discountValue } : null,
                image: variant.attributes?.image || product.mainImage,
                color: variant.attributes?.color,
                size: variant.attributes?.size,
                quantity: quantityToAdd,
                isOutOfStock: false,
                availableStock,
            }];
        });

        return { success: true, reason: existingIndex !== -1 ? 'quantity_increased' : 'added' };
    }, []);

    const removeFromCart = useCallback((variantId) => {
        setCart(prev => prev.filter(item => item.variantId !== variantId));
    }, []);

    const updateQuantity = useCallback((variantId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.variantId !== variantId) return item;
            const newQty = Math.min(Math.max(1, item.quantity + delta), item.availableStock);
            return { ...item, quantity: newQty };
        }));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        localStorage.removeItem(cartKey);
    }, [cartKey]);

    const restoreCart = useCallback((items) => {
        if (Array.isArray(items)) setCart(items);
    }, []);

    // Validation initiale au montage
    useEffect(() => {
        if (!initialValidationDone.current) {
            validateCart();
            initialValidationDone.current = true;
        }
    }, [validateCart]);

    // Polling des stocks uniquement si le tiroir est ouvert (évite les requêtes fantômes)
    useEffect(() => {
        if (!isDrawerOpen) return;
        validateCart();
        const interval = setInterval(validateCart, 10000);
        return () => clearInterval(interval);
    }, [isDrawerOpen, validateCart]);

    const totalPrice = useMemo(() =>
        cart.filter(item => !item.isOutOfStock).reduce((sum, item) => sum + item.price * item.quantity, 0)
        , [cart]);

    const totalItems = useMemo(() => cart.length, [cart]);
    const hasOutOfStock = useMemo(() => cart.some(item => item.isOutOfStock), [cart]);

    return {
        cart,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        restoreCart,
        validateCart,
        totalPrice,
        totalItems,
        hasOutOfStock
    };
};