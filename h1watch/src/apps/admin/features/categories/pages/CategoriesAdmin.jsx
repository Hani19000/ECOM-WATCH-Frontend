import { useState, useCallback } from 'react';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { CategoryFormDrawer } from '../components/CategoryFormDrawer/CategoryFormDrawer';
import { ConfirmDialog } from '../../../../../shared/UI/ConfirmDialog';
import { Plus } from 'lucide-react';

import AdminTable from '../../shared/AdminTable';
import TableToolbar from '../../shared/TableToolbar';
import { CategoryTableRow } from '../components/CategoryTable/CategoryTableRow';

const CATEGORY_HEADERS = [
    { label: 'Nom de la catégorie', className: 'text-left' },
    { label: 'Slug (URL)', className: 'text-left hidden sm:table-cell' },
    { label: <span className="sr-only sm:not-sr-only">Actions</span>, className: 'text-right' }
];

const CategoriesAdmin = () => {
    const { state, actions } = useAdminCategories();

    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
    const [editingCategoryData, setEditingCategoryData] = useState(null);

    const handleOpenCreateCategory = useCallback(() => {
        setEditingCategoryData(null);
        setIsCategoryDrawerOpen(true);
    }, []);

    const handleOpenEditCategory = useCallback((categoryData) => {
        setEditingCategoryData(categoryData);
        setIsCategoryDrawerOpen(true);
    }, []);

    const handleCloseCategoryDrawer = useCallback(() => {
        setIsCategoryDrawerOpen(false);
        setTimeout(() => setEditingCategoryData(null), 300);
    }, []);

    return (
        <div className="max-w-5xl mx-auto relative space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-8 px-2 sm:px-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Gestion des Catégories</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Organisez votre catalogue pour simplifier la navigation client.</p>
            </div>

            <div className="shadow-sm rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card transition-colors">
                <TableToolbar
                    searchTerm={state.searchQuery}
                    onSearchChange={actions.handleSearchChange}
                    searchPlaceholder="Rechercher une catégorie..."
                    actions={
                        <button
                            onClick={handleOpenCreateCategory}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Nouvelle Catégorie
                        </button>
                    }
                />

                <AdminTable
                    headers={CATEGORY_HEADERS}
                    data={state.filteredCategories}
                    emptyMessage={state.isLoading ? "Chargement..." : "Aucune catégorie trouvée."}
                    renderRow={(category) => (
                        <CategoryTableRow
                            key={category.id}
                            categoryData={category}
                            onClickEdit={handleOpenEditCategory}
                            onClickDelete={actions.requestCategoryDeletion}
                        />
                    )}
                />
            </div>

            <CategoryFormDrawer
                isDrawerOpen={isCategoryDrawerOpen}
                onCloseDrawer={handleCloseCategoryDrawer}
                initialCategoryData={editingCategoryData}
                onSuccessCallback={actions.fetchCategories}
            />

            <ConfirmDialog
                isOpen={!!state.categoryToDelete}
                onClose={actions.cancelCategoryDeletion}
                onConfirm={actions.confirmCategoryDeletion}
                title="Supprimer cette catégorie ?"
                message="Attention, cela retirera cette catégorie de tous les produits associés. Les produits eux-mêmes ne seront pas supprimés."
                confirmText="Oui, supprimer"
            />
        </div>
    );
};

export default CategoriesAdmin;