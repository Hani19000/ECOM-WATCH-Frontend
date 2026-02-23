import { useState, useCallback } from 'react';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { OrderDetailDrawer } from '../components/OrderDetailDrawer/OrderDetailDrawer';

import AdminTable from '../../shared/AdminTable';
import TableToolbar from '../../shared/TableToolbar';
import { OrderTableRow } from '../components/OrderTable/OrderTableRow';

const ORDER_HEADERS = [
    { label: 'Commande', className: 'text-left' },
    { label: 'Date', className: 'text-left hidden sm:table-cell' },
    { label: 'Client', className: 'text-left hidden md:table-cell' },
    { label: 'Statut', className: 'text-center hidden sm:table-cell' },
    { label: 'Total', className: 'text-right hidden sm:table-cell' },
    { label: <span className="sr-only sm:not-sr-only">Actions</span>, className: 'text-right' }
];

const OrdersAdmin = () => {
    const { state, actions } = useAdminOrders();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [viewingOrderId, setViewingOrderId] = useState(null);

    const handleOpenOrderDetails = useCallback((orderId) => {
        setViewingOrderId(orderId);
        setIsDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
        setTimeout(() => setViewingOrderId(null), 300);
    }, []);

    return (
        <div className="max-w-7xl mx-auto relative space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-8 px-2 sm:px-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Gestion des Commandes</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez le traitement, l'expédition et le suivi des commandes clients.</p>
            </div>

            <div className="shadow-sm rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card transition-colors">
                <TableToolbar
                    searchTerm={state.searchQuery}
                    onSearchChange={actions.handleSearchInputChange}
                    searchPlaceholder="Rechercher par N° ou email..."
                    actions={
                        <select
                            value={state.selectedStatusFilter}
                            onChange={(e) => actions.handleStatusFilterChange(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2.5 sm:py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-lg text-sm font-medium focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 outline-none cursor-pointer transition-all"
                        >
                            <option value="ALL">Toutes les commandes</option>
                            <option value="PENDING">En attente</option>
                            <option value="PAID">Payées</option>
                            <option value="PROCESSING">En préparation</option>
                            <option value="SHIPPED">Expédiées</option>
                            <option value="DELIVERED">Livrées</option>
                            <option value="CANCELLED">Annulées</option>
                        </select>
                    }
                />

                <AdminTable
                    headers={ORDER_HEADERS}
                    data={state.ordersList}
                    emptyMessage={state.isLoadingData ? "Chargement des commandes..." : "Aucune commande trouvée."}
                    renderRow={(order) => (
                        <OrderTableRow
                            key={order.id}
                            order={order}
                            onViewDetails={handleOpenOrderDetails}
                        />
                    )}
                    paginationData={state.paginationData}
                    onPageChange={actions.handlePageChange}
                />
            </div>

            <OrderDetailDrawer
                isDrawerOpen={isDrawerOpen}
                onCloseDrawer={handleCloseDrawer}
                targetOrderId={viewingOrderId}
                onSuccessCallback={actions.fetchOrders}
            />
        </div>
    );
};

export default OrdersAdmin;