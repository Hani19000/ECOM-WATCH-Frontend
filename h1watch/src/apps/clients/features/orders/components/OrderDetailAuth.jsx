import { useOrderTracking } from '../hooks/useOrdertracking';

/**
 * @component OrderDetailAuth
 *
 * Affiche le détail d'une commande pour un utilisateur authentifié.
 * Appelle GET /orders/:orderId via le Bearer token (useOrderTracking avec orderId).
 *
 * Responsabilité unique : présenter les données d'une commande déjà identifiée.
 * Le chargement est déclenché automatiquement par useOrderTracking au montage.
 */
const OrderDetailAuth = ({ orderId }) => {
    const { order, loading, error, getStatusLabel } = useOrderTracking(orderId);

    if (loading) {
        return (
            <div className="py-12 text-center text-xs uppercase tracking-widest text-gray-400">
                Chargement de la commande...
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8 text-center text-red-800 bg-red-50 text-sm font-medium">
                {error}
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 gap-4">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Commande n°</p>
                    <p className="font-mono text-xl text-gray-900">{order.orderNumber || order.id}</p>
                </div>
                <div className="md:text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Statut actuel</p>
                    <p className="font-serif text-lg text-[#ADA996]">{getStatusLabel(order.status)}</p>
                </div>
            </div>

            {/* Articles */}
            <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-900 mb-6 font-bold">
                    Articles commandés
                </h4>
                <div className="space-y-6">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-300">
                                    {item.image || item.imageUrl ? (
                                        <img
                                            src={item.image || item.imageUrl}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[10px]">IMG</span>
                                    )}
                                </div>
                                <div>
                                    {/* Rendu texte natif React : pas de risque XSS */}
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#ADA996] transition-colors">
                                        {item.productName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Quantité : {item.quantity}</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                                {Number(item.unitPrice ?? item.priceAtPurchase).toFixed(2)}€
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Totaux */}
            <div className="border-t border-gray-100 pt-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Sous-total</span>
                    <span>{Number(order.totalAmount).toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Livraison</span>
                    <span>Offerte</span>
                </div>
                <div className="flex justify-between text-lg font-serif text-gray-900 pt-4 border-t border-gray-50 mt-4">
                    <span>Total</span>
                    <span>{Number(order.totalAmount).toFixed(2)}€</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailAuth;