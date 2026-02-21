import { useEffect, useState } from 'react';
import { useOrderTracking } from '../hooks/useOrdertracking';
import { GuestOrderService } from '../api/GuestOrder.service';

/**
 * Résout l'email pour le suivi guest en combinant deux sources :
 * 1. `emailFromProps`  — passé par le parent (source la plus fiable)
 * 2. localStorage      — fallback si le parent ne l'a pas
 *
 * @param {string}      orderId
 * @param {string|null} emailFromProps
 * @returns {string|null}
 */
const resolveGuestEmail = (orderId, emailFromProps) => {
    if (emailFromProps) return emailFromProps;

    const localOrder =
        GuestOrderService.getOrderByNumber(orderId) ||
        GuestOrderService.getOrders().find((o) => o.id === orderId);

    return localOrder?.email ?? null;
};

/**
 * @component GuestTrackingForm
 *
 * Affiche le détail d'une commande invité.
 *
 * Stratégie "offline-first" :
 * 1. Affiche instantanément les données du localStorage si disponibles.
 * 2. Rafraîchit en arrière-plan via POST /orders/track-guest.
 *
 * @param {string}      orderId       - orderNumber (ex: ORD-2024-123456)
 * @param {string|null} [email]       - Email du client (prop prioritaire sur localStorage)
 */
const GuestTrackingForm = ({ orderId, email }) => {
    const {
        order,
        loading,
        error,
        getStatusLabel,
        trackGuestOrder,
        trackAuthenticatedOrder,
    } = useOrderTracking();

    const [localFallback, setLocalFallback] = useState(null);

    useEffect(() => {
        if (!orderId) return;

        // BUG FIX : l'email vient en priorité des props (passé par Profile via TrackOrderPage),
        // le localStorage n'est qu'un fallback pour les accès directs (deep link, URL).
        const resolvedEmail = resolveGuestEmail(orderId, email);

        // Affichage immédiat depuis localStorage
        const localOrder =
            GuestOrderService.getOrderByNumber(orderId) ||
            GuestOrderService.getOrders().find((o) => o.id === orderId);

        if (localOrder) {
            setLocalFallback(localOrder);
        }

        // Synchronisation serveur
        if (resolvedEmail) {
            trackGuestOrder(orderId, resolvedEmail);
        } else {
            // Cas edge : pas d'email disponible (accès direct sans session)
            trackAuthenticatedOrder(orderId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId, email]);

    // Préférence pour les données serveur (fraîches) sur le cache local
    const displayOrder = order || localFallback;

    if (loading && !displayOrder) {
        return (
            <div className="py-12 text-center text-xs uppercase tracking-widest text-gray-400">
                Chargement des détails...
            </div>
        );
    }

    if (!displayOrder) {
        return (
            <div className="py-8 text-center text-red-800 bg-red-50 text-sm font-medium rounded-lg">
                {error || 'Commande introuvable. Vérifiez vos informations.'}
            </div>
        );
    }

    return <OrderDetailView order={displayOrder} getStatusLabel={getStatusLabel} />;
};

/* ─── Sous-composants de présentation ──────────────────────────────────── */

const OrderDetailView = ({ order, getStatusLabel }) => (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 gap-4">
            <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Commande n°
                </p>
                <p className="font-mono text-xl text-gray-900">
                    {order.orderNumber || order.id}
                </p>
            </div>
            <div className="md:text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Statut actuel
                </p>
                <p className="font-serif text-lg text-[#ADA996]">
                    {getStatusLabel(order.status)}
                </p>
            </div>
        </div>

        <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-900 mb-6 font-bold">
                Articles commandés
            </h4>
            <div className="space-y-6">
                {order.items?.map((item) => (
                    <OrderItem key={item.id} item={item} />
                ))}
            </div>
        </div>

        <OrderTotals totalAmount={order.totalAmount} />
    </div>
);

const OrderItem = ({ item }) => (
    <div className="flex justify-between items-center group">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-gray-300 rounded">
                <span className="text-[10px]">IMG</span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#ADA996] transition-colors">
                    {item.productName}
                </p>
                <p className="text-xs text-gray-500 mt-1">Quantité : {item.quantity}</p>
            </div>
        </div>
        <p className="text-sm font-medium text-gray-900">
            {Number(item.unitPrice ?? item.priceAtPurchase).toFixed(2)} €
        </p>
    </div>
);

const OrderTotals = ({ totalAmount }) => (
    <div className="border-t border-gray-100 pt-6 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
            <span>Sous-total</span>
            <span>{Number(totalAmount).toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
            <span>Livraison</span>
            <span>Offerte</span>
        </div>
        <div className="flex justify-between text-lg font-serif text-gray-900 pt-4 border-t border-gray-50 mt-4">
            <span>Total</span>
            <span>{Number(totalAmount).toFixed(2)} €</span>
        </div>
    </div>
);

export default GuestTrackingForm;