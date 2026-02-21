/**
 * Extrait la logique d'état et de soumission du tiroir de mise à jour des stocks.
 * Pourquoi : Évite de polluer le composant visuel avec la gestion des inputs et la validation.
 */
import { useState } from 'react';

export const useStockUpdateLogic = (item, onAdjust, onRestock, onSuccess) => {
    // État pour savoir si nous avons changé de produit sélectionné (remplace le useEffect)
    const [prevItemId, setPrevItemId] = useState(item?.id || null);

    const [mode, setMode] = useState('restock');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState({});

    // Nouvelle recommandation React : "You might not need an effect"
    // Si l'item a changé, on réinitialise l'état PENDANT le rendu (synchrone), 
    // évitant ainsi le rendu en cascade d'un useEffect.
    if (item && item.id !== prevItemId) {
        setPrevItemId(item.id);
        setMode('restock');
        setQuantity('');
        setReason('');
        setErrors({});
    }

    const validate = () => {
        const newErrors = {};
        if (!quantity || isNaN(quantity)) {
            newErrors.quantity = 'Quantité invalide';
        } else if (mode === 'restock' && Number(quantity) <= 0) {
            newErrors.quantity = 'Le réassort doit être strictement positif';
        }

        if (mode === 'adjust' && !reason.trim()) {
            newErrors.reason = 'Une raison est requise pour un ajustement manuel';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate() || !item) return;

        // Note : On utilise l'ID de la variante (souvent confondu avec l'ID de l'inventaire)
        const variantId = item.variantId || item.variant_id;

        if (!variantId) {
            console.error("Erreur : Impossible de trouver l'ID de la variante", item);
            return;
        }

        const qty = Number(quantity);

        let success = false;
        if (mode === 'restock') {
            success = await onRestock(variantId, qty);
        } else {
            success = await onAdjust(variantId, qty, reason);
        }

        if (success && onSuccess) {
            onSuccess();
        }
    };

    return {
        mode,
        setMode,
        quantity,
        setQuantity,
        reason,
        setReason,
        errors,
        handleSubmit
    };
};