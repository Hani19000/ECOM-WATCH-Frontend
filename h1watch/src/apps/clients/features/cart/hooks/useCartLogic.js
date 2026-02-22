import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ProductService from '../../products/api/product.service';
import logger from '../../../../../core/utils/logger';
import toast from 'react-hot-toast';

/**
 * Encapsule toute la logique métier et l'état du panier.
 * Garantit que le composant Provider reste un simple passe-plat.
 */
export const useCartLogic = (cartKey) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(cartKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            logger.error("Échec de la récupération du panier local", error);
            return [];
        }
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Évite les dépendances cycliques lors de la validation
    const cartRef = useRef(cart);
    const initialValidationDone = useRef(false);

    useEffect(() => {
        cartRef.current = cart;
    }, [cart]);

    const validateCart = useCallback(async () => {
        const currentCart = cartRef.current;
        if (!currentCart || currentCart.length === 0) return true;

        const ids = currentCart
            .map(item => item.variantId)
            .filter(Boolean); // Retire undefined, null, ''

        if (ids.length === 0) return true;

        try {
            const { stockMap } = await ProductService.validateVariants(ids);
            let isValid = true;
            let removedItemsNames = [];

            setCart(prev => {
                const removedItems = [];
                const updatedCart = prev.map(item => {
                    if (!item.variantId) return null;

                    const stock = stockMap[item.variantId];

                    if (stock === undefined) {
                        removedItems.push(item.name);
                        isValid = false;
                        return null;
                    }

                    if (stock === 0 || stock < item.quantity) {
                        isValid = false;
                    }

                    return {
                        ...item,
                        isOutOfStock: stock === 0,
                        availableStock: stock,
                        quantity: Math.min(item.quantity, stock || 1),
                    };
                }).filter(Boolean);

                removedItemsNames = removedItems;
                return updatedCart;
            });

            if (removedItemsNames.length > 0) {
                toast.error(`Articles retirés : ${removedItemsNames.join(', ')}`, {
                    id: 'cart-validation-error'
                });
            }
            return isValid;
        } catch (error) {
            logger.error("Erreur de validation du panier via API", error);
            return true; // Fail-open strategy
        }
    }, []);

    const addToCart = useCallback((product, variant, qty = 1) => {
        const quantityToAdd = Number(qty);
        const currentCart = cartRef.current;
        const existingItemIndex = currentCart.findIndex(item => item.variantId === variant.id);
        const initialStock = variant.inventory?.availableStock ?? 0;

        if (existingItemIndex !== -1) {
            const currentItem = currentCart[existingItemIndex];
            const availableStock = currentItem.availableStock ?? initialStock;

            if (currentItem.quantity + quantityToAdd > availableStock) {
                return { success: false, reason: 'out_of_stock' };
            }
        } else if (quantityToAdd > initialStock) {
            return { success: false, reason: 'out_of_stock' };
        }

        setCart(prev => {
            const index = prev.findIndex(item => item.variantId === variant.id);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    quantity: updated[index].quantity + quantityToAdd
                };
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
                promotion: promotion ? {
                    discountType: promotion.discountType,
                    discountValue: promotion.discountValue,
                } : null,
                image: variant.attributes?.image || product.mainImage,
                color: variant.attributes?.color,
                size: variant.attributes?.size,
                quantity: quantityToAdd,
                isOutOfStock: false,
                availableStock: initialStock,
            }];
        });

        return { success: true, reason: existingItemIndex !== -1 ? 'quantity_increased' : 'added' };
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
        if (Array.isArray(items)) {
            setCart(items);
        }
    }, []);

    // Persistance automatique
    useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }, [cart, cartKey]);

    // Validation initiale
    useEffect(() => {
        if (!initialValidationDone.current) {
            validateCart();
            initialValidationDone.current = true;
        }
    }, [validateCart]);

    // Polling pendant l'ouverture du tiroir
    useEffect(() => {
        if (!isDrawerOpen) return;
        validateCart();
        const interval = setInterval(validateCart, 10000);
        return () => clearInterval(interval);
    }, [isDrawerOpen, validateCart]);

    const totalPrice = useMemo(() =>
        cart.filter(item => !item.isOutOfStock)
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
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