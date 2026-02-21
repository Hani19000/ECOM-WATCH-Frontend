import { PackagePlus } from 'lucide-react';

const InventoryTableRow = ({ item, onEdit }) => {
    const availableStock = Number(item.availableStock ?? item.available_stock ?? 0);
    const reservedStock = Number(item.reservedStock ?? item.reserved_stock ?? 0);
    const productName = item.productName || item.product_name || 'Produit inconnu';

    const isOutOfStock = availableStock === 0;
    const isLowStock = availableStock > 0 && availableStock <= 5;

    const statusClasses = isOutOfStock
        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/30'
        : isLowStock
            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/30'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/30';

    const statusLabel = isOutOfStock ? 'Rupture' : isLowStock ? 'Stock Faible' : 'En Stock';
    const formattedPrice = `${Number(item.price).toFixed(2)} €`;

    return (
        <tr className="border-b border-gray-50 dark:border-dark-border hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
            <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex flex-col min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{productName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono truncate">{item.sku}</div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 sm:hidden">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{formattedPrice}</span>
                        <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                        <span className={`text-[10px] font-bold ${isLowStock || isOutOfStock ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {availableStock} dispo
                        </span>
                        <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${statusClasses}`}>
                            {statusLabel}
                        </span>
                    </div>
                </div>
            </td>

            <td className="py-3 sm:py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                {formattedPrice}
            </td>
            <td className="py-3 sm:py-4 px-4 text-center hidden sm:table-cell">
                <span className={`text-sm font-bold ${isLowStock || isOutOfStock ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {availableStock}
                </span>
            </td>
            <td className="py-3 sm:py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                {reservedStock}
            </td>
            <td className="py-3 sm:py-4 px-4 text-center hidden md:table-cell">
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${statusClasses}`}>
                    {statusLabel}
                </span>
            </td>

            <td className="py-3 sm:py-4 pl-2 pr-4 sm:px-4 text-right">
                <button
                    onClick={() => onEdit(item)}
                    title="Ajuster le stock"
                    className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 outline-none"
                >
                    <PackagePlus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-1.5 text-gray-500 dark:text-gray-400" />
                    <span className="hidden sm:inline">Ajuster</span>
                </button>
            </td>
        </tr>
    );
};

export default InventoryTableRow;