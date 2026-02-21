import { Edit2, Trash2, PlusCircle } from 'lucide-react';

export const ProductTableRow = ({ product, onEdit, onAddVariant, onDelete }) => {
    const price = product.variantsPreview?.[0]?.price || product.startingPrice || product.price || 0;
    const stock = product.variantsPreview?.reduce((acc, v) => acc + (v.inventory?.availableStock || 0), 0) || 0;
    const isOutOfStock = stock === 0;

    // Badges adaptés pour le Dark Mode (ajout d'opacité sur les fonds sombres)
    const statusStyles = {
        ACTIVE: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
        DRAFT: 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700',
        ARCHIVED: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/30'
    };

    const statusLabels = {
        ACTIVE: 'Publié',
        DRAFT: 'Brouillon',
        ARCHIVED: 'Archivé'
    };

    const formattedPrice = `${Number(price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-100 dark:border-dark-border">

            <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex-shrink-0">
                        <img
                            src={product.mainImage || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:block">{product.slug}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-1 sm:hidden">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{formattedPrice}</span>
                            <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                            <span className={`text-[10px] font-bold ${isOutOfStock ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {isOutOfStock ? 'Rupture' : `${stock} en stock`}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            <td className="py-3 sm:py-4 px-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                {product.displayCategory}
            </td>

            <td className="py-3 sm:py-4 px-4 text-sm text-gray-900 dark:text-white font-semibold text-center hidden sm:table-cell">
                {formattedPrice}
            </td>

            <td className="py-3 sm:py-4 px-4 text-center hidden sm:table-cell">
                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {product.variantsPreview?.length || 0} var.
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${isOutOfStock ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                        {isOutOfStock ? 'Rupture' : `${stock} en stock`}
                    </span>
                </div>
            </td>

            <td className="py-3 sm:py-4 px-4 text-center hidden md:table-cell">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${statusStyles[product.status] || statusStyles.DRAFT}`}>
                    {statusLabels[product.status] || 'Brouillon'}
                </span>
            </td>

            {/* Boutons d'action adaptés pour le Dark Mode */}
            <td className="py-3 sm:py-4 pl-2 pr-4 sm:px-4 text-right">
                <div className="flex items-center justify-end sm:gap-1">
                    <button onClick={() => onAddVariant(product.id)} title="Ajouter une variante" className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors focus:ring-2 focus:ring-green-500/50 outline-none">
                        <PlusCircle className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                    <button onClick={() => onEdit(product.id)} title="Modifier" className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:ring-2 focus:ring-blue-500/50 outline-none">
                        <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                    <button onClick={() => onDelete(product.id)} title="Supprimer" className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:ring-2 focus:ring-red-500/50 outline-none">
                        <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};