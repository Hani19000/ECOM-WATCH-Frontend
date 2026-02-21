/**
 * @module Hook/useGuestOrders
 *
 * ─── CORRECTION DU BUG "commandes toujours visibles après inscription" ───────
 *
 * AVANT :
 * Le hook n'écoutait que l'événement natif 'storage', qui ne se déclenche
 * PAS dans le même onglet. Résultat : après register() ou login(), quand
 * useAuth.js appelait GuestOrderService.clearAll(), le state React de ce
 * hook restait figé → les commandes guest restaient affichées.
 *
 * APRÈS :
 * On écoute EN PLUS le CustomEvent 'guestOrdersChanged' dispatché par
 * GuestOrderService après chaque écriture (même onglet).
 * → La liste se vide instantanément après inscription ou connexion,
 *   sans setTimeout, sans polling, sans remontage de composant.
 */
import { useState, useEffect, useCallback } from 'react';
import { GuestOrderService } from '../api/GuestOrder.service';

// Même constante que dans GuestOrderService pour éviter la duplication de la chaîne
const CHANGE_EVENT = 'guestOrdersChanged';

export const useGuestOrders = () => {
    const [orders, setOrders] = useState(() => GuestOrderService.getOrders());

    const refreshOrders = useCallback(() => {
        setOrders(GuestOrderService.getOrders());
    }, []);

    const addOrder = useCallback((orderInfo) => {
        const success = GuestOrderService.addOrder(orderInfo);
        // addOrder appelle _save() qui dispatch guestOrdersChanged
        // → refreshOrders sera appelé automatiquement via le listener ci-dessous.
        // On n'appelle PAS refreshOrders() ici pour éviter la double exécution.
        return success;
    }, []);

    const removeOrder = useCallback((identifier) => {
        return GuestOrderService.removeOrder(identifier);
        // Même principe : _save() dispatche → listener appelé automatiquement.
    }, []);

    useEffect(() => {
        // ─── Écoute MÊME ONGLET (CustomEvent dispatché par GuestOrderService._save) ─
        const handleSameTab = () => refreshOrders();

        // ─── Écoute AUTRES ONGLETS (événement natif 'storage') ────────────────────
        const handleCrossTab = (e) => {
            if (e.key === 'h1_guest_orders') refreshOrders();
        };

        window.addEventListener(CHANGE_EVENT, handleSameTab);
        window.addEventListener('storage', handleCrossTab);

        return () => {
            window.removeEventListener(CHANGE_EVENT, handleSameTab);
            window.removeEventListener('storage', handleCrossTab);
        };
    }, [refreshOrders]);

    return {
        orders,
        hasOrders: orders.length > 0,
        addOrder,
        removeOrder,
        refreshOrders, // Exposé pour les cas edge (ex: refresh manuel depuis un composant parent)
    };
};