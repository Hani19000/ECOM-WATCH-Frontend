import { useState } from 'react';
import { useAdminInventory } from '../hooks/useAdminInventory';
import { AlertTriangle } from 'lucide-react';

import TableToolbar from '../../shared/TableToolbar';
import AdminTable from '../../shared/AdminTable';

import InventoryTableRow from '../components/InventoryTable/InventoryTableRow';
import StockUpdateDrawer from '../components/StockUpdateDrawer/StockUpdateDrawer';

const INVENTORY_HEADERS = [
    { label: 'Produit & SKU', className: 'text-left' },
    { label: 'Prix', className: 'text-center hidden sm:table-cell' },
    { label: 'Stock Dispo', className: 'text-center hidden sm:table-cell' },
    { label: 'Réservé', className: 'text-center hidden md:table-cell' },
    { label: 'Statut', className: 'text-center hidden md:table-cell' },
    { label: <span className="sr-only sm:not-sr-only">Actions</span>, className: 'text-right' }
];

const InventoryAdmin = () => {
    const { inventory, alerts, filters, isUpdating, updateFilters, adjustStock, restock } = useAdminInventory();
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="max-w-7xl mx-auto relative space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-8 px-2 sm:px-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Inventaire & Logistique</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les stocks, les réassorts et consultez les alertes.</p>
            </div>

            {alerts?.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-xl p-4 flex items-start gap-3 transition-colors">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Action requise</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-500">{alerts.length} produit(s) nécessitent un réassort.</p>
                    </div>
                </div>
            )}

            <div className="shadow-sm rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card transition-colors">
                <TableToolbar
                    searchTerm={filters.search}
                    onSearchChange={(value) => updateFilters({ search: value })}
                    searchPlaceholder="Rechercher par SKU ou nom..."
                />
                <AdminTable
                    headers={INVENTORY_HEADERS}
                    data={inventory}
                    emptyMessage="Aucun produit trouvé."
                    renderRow={(item) => (
                        <InventoryTableRow
                            key={item.variantId || item.variant_id || item.id}
                            item={item}
                            onEdit={setSelectedItem}
                        />
                    )}
                />
            </div>

            <StockUpdateDrawer
                isOpen={!!selectedItem}
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                isUpdating={isUpdating}
                onAdjust={adjustStock}
                onRestock={restock}
            />
        </div>
    );
};

export default InventoryAdmin;