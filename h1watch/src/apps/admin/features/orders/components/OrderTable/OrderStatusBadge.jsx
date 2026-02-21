export const OrderStatusBadge = ({ currentStatus }) => {
    const statusConfig = {
        PENDING: { color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30', label: 'En attente' },
        PAID: { color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30', label: 'Payée' },
        PROCESSING: { color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/30', label: 'En préparation' },
        SHIPPED: { color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30', label: 'Expédiée' },
        DELIVERED: { color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30', label: 'Livrée' },
        CANCELLED: { color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30', label: 'Annulée' },
        REFUNDED: { color: 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700', label: 'Remboursée' },
    };

    const config = statusConfig[currentStatus] || { color: 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-transparent', label: currentStatus };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${config.color}`}>
            {config.label}
        </span>
    );
};