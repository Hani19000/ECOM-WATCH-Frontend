import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';

/**
 * @component OrderHistory
 * @description Historique des commandes (Vue Authentifiée).
 * * STYLE : Minimaliste, tabulaire, sans couleurs agressives.
 */

// Mapping des statuts (Texte simple au lieu de badges)
const STATUS_LABELS = {
    PENDING: 'En attente',
    PAID: 'Payée',
    PROCESSING: 'Préparation',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
    REFUNDED: 'Remboursée',
};

const OrderHistory = ({ onSelectOrder }) => {
    const { orders, loading, pagination, fetchOrders } = useOrders();
    const [currentPage, setCurrentPage] = useState(1);

    // Filtre supprimé visuellement pour simplifier l'UI luxe (optionnel : on peut le remettre si critique)
    // Pour l'instant on fetch tout
    useEffect(() => {
        fetchOrders({ page: currentPage, limit: 10 });
    }, [currentPage, fetchOrders]);


    // ─── Loading State (Skeleton) ─────────────────────────────────────────────
    if (loading && (!orders || orders.length === 0)) {
        return (
            <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between py-6 border-b border-gray-50">
                        <div className="h-4 bg-gray-100 w-24" />
                        <div className="h-4 bg-gray-100 w-32" />
                        <div className="h-4 bg-gray-100 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    // ─── Empty State ──────────────────────────────────────────────────────────
    if (!orders || orders.length === 0) {
        return (
            <div className="py-20 text-center border-t border-gray-100">
                <p className="text-gray-400 font-light italic mb-6">Vous n'avez pas encore passé de commande.</p>
                <a href="/catalogue" className="text-xs font-bold uppercase tracking-[0.2em] border-b border-gray-900 pb-1 hover:text-[#ADA996] hover:border-[#ADA996] transition-all">
                    Découvrir la collection
                </a>
            </div>
        );
    }

    // ─── Main List ────────────────────────────────────────────────────────────
    return (
        <div className="w-full animate-fadeIn">
            <header className="mb-10 flex justify-between items-end">
                <h3 className="text-3xl font-serif text-gray-900 italic">Mes Commandes</h3>
                <span className="text-xs text-gray-400 font-light">{pagination?.totalOrders || orders.length} commandes</span>
            </header>

            {/* En-têtes du tableau (Desktop) */}
            <div className="hidden md:grid grid-cols-12 pb-4 border-b border-gray-200 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                <div className="col-span-3">N° Commande</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-3">Statut</div>
                <div className="col-span-3 text-right">Total</div>
            </div>

            {/* Liste */}
            <div className="divide-y divide-gray-100 border-b border-gray-100">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="group py-6 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => onSelectOrder(order.id)}
                    >
                        {/* ID */}
                        <div className="md:col-span-3">
                            <span className="font-mono text-sm text-gray-900 group-hover:text-[#ADA996] transition-colors">
                                #{order.orderNumber || order.id.slice(0, 8)}
                            </span>
                        </div>

                        {/* Date */}
                        <div className="md:col-span-3 text-sm text-gray-500 font-light">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </div>

                        {/* Statut (Texte épuré) */}
                        <div className="md:col-span-3">
                            <span className={`text-[10px] uppercase tracking-widest font-medium ${order.status === 'DELIVERED' ? 'text-gray-900' : 'text-[#ADA996]'
                                }`}>
                                {STATUS_LABELS[order.status] || order.status}
                            </span>
                        </div>

                        {/* Montant & Action */}
                        <div className="md:col-span-3 w-full flex justify-between md:justify-end items-center gap-6">
                            <span className="text-sm font-medium text-gray-900">
                                {Number(order.totalAmount).toFixed(2)}€
                            </span>

                            <span className="hidden md:inline-block text-[10px] uppercase tracking-widest text-gray-300 group-hover:text-gray-900 transition-colors">
                                Voir →
                            </span>

                            {/* Bouton mobile uniquement */}
                            <button className="md:hidden text-[10px] uppercase tracking-widest border-b border-gray-300 pb-0.5">
                                Détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Style Luxe */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-8 mt-12">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Précédent
                    </button>

                    <span className="font-serif text-sm text-gray-900 italic">
                        Page {currentPage} <span className="text-gray-300 mx-1">/</span> {pagination.totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                        disabled={currentPage === pagination.totalPages}
                        className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;