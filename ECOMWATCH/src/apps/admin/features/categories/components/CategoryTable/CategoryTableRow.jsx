import { Edit2, Trash2 } from 'lucide-react';

export const CategoryTableRow = ({ categoryData, onClickEdit, onClickDelete }) => (
    <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-100 dark:border-dark-border">

        <td className="py-3 sm:py-4 px-3 sm:px-4">
            <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{categoryData.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono truncate sm:hidden">{categoryData.slug}</p>
            </div>
        </td>

        <td className="py-3 sm:py-4 px-4 text-sm text-gray-500 dark:text-gray-400 font-mono hidden sm:table-cell">
            {categoryData.slug}
        </td>

        <td className="py-3 sm:py-4 pl-2 pr-4 sm:px-4 text-right">
            <div className="flex items-center justify-end sm:gap-1">
                <button
                    type="button"
                    onClick={() => onClickEdit(categoryData)}
                    title="Modifier la catégorie"
                    className="p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:ring-2 focus:ring-blue-500/50 outline-none"
                >
                    <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => onClickDelete(categoryData.id)}
                    title="Supprimer la catégorie"
                    className="p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:ring-2 focus:ring-red-500/50 outline-none"
                >
                    <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
            </div>
        </td>
    </tr>
);