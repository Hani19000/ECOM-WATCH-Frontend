export const RecentOrdersTable = ({ orders }) => (
    <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm h-full flex flex-col transition-colors">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white transition-colors">Dernières Commandes</h3>
        </div>

        <div className="flex-1 space-y-2 pr-1 custom-scrollbar">
            {orders.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Aucune transaction récente.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-dark-border hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Avatar reste fixe */}
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-border shrink-0 transition-colors">
                                {order.user?.firstName?.[0] || 'I'}
                            </div>

                            {/* Conteneur texte avec min-w-0 pour permettre le truncate */}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate transition-colors">
                                    {order.user?.firstName
                                        ? `${order.user.firstName} ${order.user.lastName || ''}`
                                        : (order.shippingAddress?.email || 'Client Inconnu')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors">#{order.orderNumber}</p>
                            </div>
                        </div>

                        {/* Bloc Prix : shrink-0 pour ne JAMAIS être compressé, et text-right */}
                        <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors whitespace-nowrap">
                                {Number(order.totalAmount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase mt-0.5 transition-colors">{order.status}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);