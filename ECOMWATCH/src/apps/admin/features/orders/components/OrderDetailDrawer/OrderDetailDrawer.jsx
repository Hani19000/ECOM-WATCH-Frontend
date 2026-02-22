import { MapPin, CreditCard, Package } from 'lucide-react';
import { useOrderDetailLogic } from '../../hooks/useOrderDetailLogic';
import { OrderStatusBadge } from '../OrderTable/OrderStatusBadge';
import AdminDrawer from '../../../shared/AdminDrawer';

export const OrderDetailDrawer = ({ isDrawerOpen, onCloseDrawer, targetOrderId, onSuccessCallback }) => {
    const {
        orderDetails, isLoadingDetails, isUpdatingStatus, pendingStatusChange,
        handleSelectStatusChange, submitStatusUpdate
    } = useOrderDetailLogic(targetOrderId, isDrawerOpen, onCloseDrawer, onSuccessCallback);

    const drawerHeaderBadge = orderDetails && (
        <div className="mt-3">
            <OrderStatusBadge currentStatus={orderDetails.status} />
        </div>
    );

    return (
        <AdminDrawer
            isOpen={isDrawerOpen}
            onClose={onCloseDrawer}
            title={orderDetails ? `Commande #${orderDetails.orderNumber}` : 'Détails de la commande'}
            headerContent={drawerHeaderBadge}
        >
            {isLoadingDetails || !orderDetails ? (
                <div className="flex-1 flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-gray-200 dark:border-dark-border border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* SECTION 1: MISE À JOUR DU STATUT */}
                    <div className="bg-white dark:bg-slate-800/30 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm transition-colors">
                        <h3 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" /> Progression de la commande
                        </h3>
                        <form onSubmit={submitStatusUpdate} className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={pendingStatusChange}
                                onChange={handleSelectStatusChange}
                                className="w-full sm:flex-1 px-3 py-3 sm:py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/20 transition-all outline-none truncate"
                            >
                                <option value="PENDING">En attente</option>
                                <option value="PAID">Payée</option>
                                <option value="PROCESSING">En préparation</option>
                                <option value="SHIPPED">Expédiée</option>
                                <option value="DELIVERED">Livrée</option>
                                <option value="CANCELLED">Annulée</option>
                                <option value="REFUNDED">Remboursée</option>
                            </select>
                            <button
                                type="submit"
                                disabled={isUpdatingStatus || pendingStatusChange === orderDetails.status}
                                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-black dark:bg-white text-white dark:text-gray-900 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                            >
                                {isUpdatingStatus ? '...' : 'Mettre à jour'}
                            </button>
                        </form>
                    </div>

                    {/* SECTION 2: ADRESSE */}
                    <div className="bg-white dark:bg-slate-800/30 p-5 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm transition-colors">
                        <h3 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Expédition & Contact
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p className="font-semibold text-gray-900 dark:text-white">{orderDetails.shippingAddress?.firstName} {orderDetails.shippingAddress?.lastName}</p>
                            <p>{orderDetails.shippingAddress?.email}</p>
                            <p>{orderDetails.shippingAddress?.phone}</p>
                            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-dark-border">
                                <p>{orderDetails.shippingAddress?.addressLine1}</p>
                                {orderDetails.shippingAddress?.addressLine2 && <p>{orderDetails.shippingAddress?.addressLine2}</p>}
                                <p>{orderDetails.shippingAddress?.postalCode} {orderDetails.shippingAddress?.city}</p>
                                <p>{orderDetails.shippingAddress?.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ARTICLES */}
                    <div className="bg-white dark:bg-slate-800/30 p-5 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm transition-colors">
                        <h3 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Contenu de la commande
                        </h3>
                        <div className="space-y-4">
                            {orderDetails.items?.map((item) => (
                                <div key={item.id} className="flex justify-between items-start border-b border-gray-50 dark:border-dark-border pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.productName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qte: {item.quantity} × {parseFloat(item.unitPrice).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {(item.quantity * parseFloat(item.unitPrice)).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{parseFloat(orderDetails.totalAmount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                    </div>
                </div>
            )}
        </AdminDrawer>
    );
};