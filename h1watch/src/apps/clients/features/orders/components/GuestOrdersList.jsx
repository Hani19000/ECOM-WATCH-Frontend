/**
 * @component GuestOrdersList
 *
 * Liste des commandes locales (localStorage) pour un utilisateur non connecté.
 *
 * CONTRAT : onSelectOrder(orderNumber, email)
 *
 * POURQUOI orderNumber+email et non l'UUID :
 * Le tracking guest passe par POST /orders/track-guest (numéro + email).
 * Appeler GET /orders/:uuid sans Bearer token et sans ?email= provoquait
 * un TypeError côté service (email.trim() sur undefined) → 500.
 * L'email stocké dans le localStorage est celui saisi au checkout :
 * il correspond exactement à la vérification timing-safe du serveur.
 */

const STATUS_TEXT = {
    PENDING: 'En attente',
    PAID: 'Payée',
    PROCESSING: 'En cours de préparation',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
    REFUNDED: 'Remboursée',
};

const GuestOrdersList = ({ orders, onSelectOrder }) => {

    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-20 border-t border-gray-100">
                <p className="text-gray-400 font-light italic">
                    Aucune commande récente trouvée sur cet appareil.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="hidden md:grid grid-cols-12 pb-4 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-400 font-medium">
                <div className="col-span-3">N° Commande</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-3">Statut</div>
                <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="group py-6 md:py-5 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 transition-colors hover:bg-gray-50/50"
                    >
                        <div className="md:col-span-3">
                            <span className="font-mono text-sm text-gray-900">
                                #{order.orderNumber || order.id.slice(0, 8)}
                            </span>
                        </div>

                        <div className="md:col-span-3 text-sm text-gray-600 font-light">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </div>

                        <div className="md:col-span-3">
                            <span className={`text-xs uppercase tracking-widest font-medium ${order.status === 'DELIVERED' ? 'text-green-900' :
                                    order.status === 'CANCELLED' ? 'text-red-900' : 'text-[#ADA996]'
                                }`}>
                                {STATUS_TEXT[order.status] || order.status}
                            </span>
                        </div>

                        <div className="md:col-span-3 w-full flex justify-between md:justify-end items-center gap-6">
                            <span className="text-sm font-medium text-gray-900">
                                {Number(order.totalAmount).toFixed(2)}€
                            </span>

                            {/*
                             * FIX : on passe orderNumber + email, pas order.id (UUID).
                             * L'UUID sans token → GET /orders/:id sans ?email= → 500.
                             * Le tracking guest requiert numéro + email via POST /track-guest.
                             */}
                            <button
                                onClick={() => onSelectOrder(order.orderNumber, order.email)}
                                className="border-b border-gray-900 text-gray-900 pb-0.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-[#ADA996] hover:border-[#ADA996] transition-all"
                            >
                                Détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuestOrdersList;