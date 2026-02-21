import { useState } from 'react';
import { useAdminPromotions } from '../hooks/useAdminPromotions';
import { Plus } from 'lucide-react';

import AdminTable from '../../shared/AdminTable';
import TableToolbar from '../../shared/TableToolbar';
import { ConfirmDialog } from '../../../../../shared/UI/ConfirmDialog';

import { PromotionTableRow } from '../components/PromotionTableRow';
import { PromotionFormDrawer } from '../components/PromotionFormDrawer';

const PROMO_HEADERS = [
    { label: 'Promotion', className: 'text-left' },
    { label: 'Remise', className: 'text-center hidden sm:table-cell' },
    { label: 'Période', className: 'text-center hidden md:table-cell' },
    { label: 'Utilisations', className: 'text-center hidden sm:table-cell' },
    { label: 'Statut', className: 'text-center hidden sm:table-cell' },
    { label: <span className="sr-only sm:not-sr-only">Actions</span>, className: 'text-right' }
];

const PromotionsAdmin = () => {
    const { state, actions } = useAdminPromotions();
    const [editingPromoId, setEditingPromoId] = useState(null);

    const handleOpenForm = (id) => setEditingPromoId(id);
    const handleCloseForm = () => setEditingPromoId(null);

    return (
        <div className="max-w-7xl mx-auto relative space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-8 px-2 sm:px-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Promotions & Soldes</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez vos campagnes promotionnelles et vos réductions.</p>
            </div>

            <div className="shadow-sm rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card transition-colors">
                <TableToolbar
                    searchPlaceholder="Rechercher désactivée sur cette vue..."
                    actions={
                        <button
                            onClick={() => handleOpenForm('new')}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Nouvelle Promotion
                        </button>
                    }
                />

                <AdminTable
                    headers={PROMO_HEADERS}
                    data={state.promotions}
                    emptyMessage={state.loading ? "Chargement des promotions..." : "Aucune promotion trouvée."}
                    renderRow={(promo) => (
                        <PromotionTableRow
                            key={promo.id}
                            promotion={promo}
                            onEdit={handleOpenForm}
                            onToggle={actions.handleToggleStatus}
                            onDelete={actions.requestDelete}
                        />
                    )}
                />
            </div>

            <PromotionFormDrawer
                isOpen={!!editingPromoId}
                onClose={handleCloseForm}
                promoId={editingPromoId}
                onSuccess={actions.fetchPromotions}
            />

            <ConfirmDialog
                isOpen={!!state.promoToDelete}
                onClose={actions.cancelDelete}
                onConfirm={actions.confirmDelete}
                title="Supprimer cette promotion ?"
                message="Attention, cette action est irréversible. Les produits retrouveront immédiatement leur prix d'origine."
                confirmText="Oui, supprimer"
            />
        </div>
    );
};

export default PromotionsAdmin;