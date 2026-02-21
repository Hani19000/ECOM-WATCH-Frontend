import { Edit2, Trash2, Power, Percent, Euro } from 'lucide-react';

export const PromotionTableRow = ({ promotion, onEdit, onToggle, onDelete }) => {
    const isPercentage = promotion.discountType === 'PERCENTAGE';
    const isActive = promotion.status === 'ACTIVE';

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <tr className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-100 dark:border-dark-border ${!isActive ? 'opacity-75' : ''}`}>
            {/* Colonne Principale (Condensée sur mobile) */}
            <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{promotion.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none">{promotion.description || 'Aucune description'}</p>

                    {/* Vue Mobile : Info clés condensées */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:hidden">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white font-bold text-[10px] transition-colors">
                            {promotion.discountValue}
                            {isPercentage ? <Percent className="w-3 h-3 text-gray-500 dark:text-gray-400" /> : <Euro className="w-3 h-3 text-gray-500 dark:text-gray-400" />}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                        <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                            {isActive ? 'Actif' : 'Inactif'}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">{promotion.usageCount || 0}/{promotion.maxUsage || '∞'} util.</span>
                    </div>
                </div>
            </td>

            {/* Colonnes Desktop */}
            <td className="py-3 sm:py-4 px-4 text-center hidden sm:table-cell">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white font-bold text-sm transition-colors">
                    {promotion.discountValue}
                    {isPercentage ? <Percent className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" /> : <Euro className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}
                </div>
            </td>
            <td className="py-3 sm:py-4 px-4 text-center hidden md:table-cell">
                <p className="text-xs text-gray-900 dark:text-white font-medium">{formatDate(promotion.startDate)}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">au {formatDate(promotion.endDate)}</p>
            </td>
            <td className="py-3 sm:py-4 px-4 text-center text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                {promotion.usageCount || 0} / {promotion.maxUsage || '∞'}
            </td>
            <td className="py-3 sm:py-4 px-4 text-center hidden sm:table-cell">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>
                    {isActive ? 'Actif' : 'Inactif'}
                </span>
            </td>

            {/* Colonne Actions (Visible) */}
            <td className="py-3 sm:py-4 pl-2 pr-4 sm:px-4 text-right">
                <div className="flex items-center justify-end sm:gap-1">
                    <button onClick={() => onToggle(promotion.id)} title={isActive ? "Désactiver" : "Activer"} className={`p-2 sm:p-1.5 rounded-lg transition-colors focus:ring-2 outline-none ${isActive ? 'text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:ring-orange-500/50' : 'text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500/50'}`}>
                        <Power className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                    <button onClick={() => onEdit(promotion.id)} title="Modifier" className="p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:ring-2 focus:ring-blue-500/50 outline-none">
                        <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                    <button onClick={() => onDelete(promotion.id)} title="Supprimer" className="p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:ring-2 focus:ring-red-500/50 outline-none">
                        <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};