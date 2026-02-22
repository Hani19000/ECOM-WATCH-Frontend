import { Eye } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';

export const OrderTableRow = ({ order, onViewDetails }) => {
    if (!order) return null;

    const formattedDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const shortDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short'
    });

    const amount = parseFloat(order.totalAmount || 0).toLocaleString('fr-FR', {
        style: 'currency', currency: 'EUR'
    });

    const customerEmail = order.user?.email || order.shippingAddress?.email || order.shipping_address?.email || 'Invité';

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-100 dark:border-dark-border">
            <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">#{order.orderNumber}</p>

                    <div className="flex flex-col gap-2 mt-1.5 sm:hidden">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{amount}</span>
                            <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{shortDate}</span>
                        </div>
                        <div className="flex">
                            <OrderStatusBadge currentStatus={order.status} />
                        </div>
                    </div>
                </div>
            </td>

            <td className="py-3 sm:py-4 px-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                {formattedDate}
            </td>

            <td className="py-3 sm:py-4 px-4 hidden md:table-cell">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{customerEmail}</p>
                {!(order.userId || order.user_id) && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">Compte Invité</span>
                )}
            </td>

            <td className="py-3 sm:py-4 px-4 hidden sm:table-cell">
                <div className="flex justify-center">
                    <OrderStatusBadge currentStatus={order.status} />
                </div>
            </td>

            <td className="py-3 sm:py-4 px-4 hidden sm:table-cell text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{amount}</p>
            </td>

            <td className="py-3 sm:py-4 pl-2 pr-4 sm:px-4 text-right">
                <button
                    type="button"
                    onClick={() => onViewDetails(order.id)}
                    title="Voir les détails"
                    className="inline-flex items-center justify-center p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:ring-2 focus:ring-blue-500/50 outline-none"
                >
                    <Eye className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
            </td>
        </tr>
    );
};