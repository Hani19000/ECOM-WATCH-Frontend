import { Search } from 'lucide-react';

const TableToolbar = ({ searchTerm, onSearchChange, searchPlaceholder = "Rechercher...", actions }) => (
    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-dark-border flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white dark:bg-dark-card rounded-t-xl transition-colors duration-200">

        {/* Champ de recherche */}
        <div className="relative w-full lg:w-96 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
        </div>

        {/* Actions (Boutons d'ajout, export...) */}
        {actions && (
            <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                {actions}
            </div>
        )}
    </div>
);

export default TableToolbar;