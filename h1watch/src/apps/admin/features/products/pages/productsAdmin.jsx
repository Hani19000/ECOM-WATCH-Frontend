import { useState } from 'react';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { Plus } from 'lucide-react';

// Composants partagés
import AdminTable from '../../shared/AdminTable';
import TableToolbar from '../../shared/TableToolbar';
import { ConfirmDialog } from '../../../../../shared/UI/ConfirmDialog';

// Ligne spécifique aux produits
import { ProductTableRow } from '../components/productTable/ProductTableRow';
import { ProductFormDrawer } from '../components/ProductFormDrawer/ProductFormDrawer';
import { VariantFormDrawer } from '../components/VariantFormDrawer/VariantFormDrawer';
import { VariantEditDrawer } from '../components/VariantEditDrawer';

const PRODUCT_HEADERS = [
    { label: 'Produit', className: 'text-left' },
    { label: 'Catégorie', className: 'text-left hidden md:table-cell' },
    { label: 'Prix moyen', className: 'text-center hidden sm:table-cell' },
    { label: 'Variantes', className: 'text-center hidden sm:table-cell' },
    { label: 'Statut', className: 'text-center hidden md:table-cell' },
    { label: <span className="sr-only sm:not-sr-only">Actions</span>, className: 'text-right' }
];

const ProductsAdmin = () => {
    const { state, actions } = useAdminProducts();
    const [editingProductId, setEditingProductId] = useState(null);
    const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
    const [variantProductId, setVariantProductId] = useState(null);
    const [editingVariant, setEditingVariant] = useState(null);

    const handleEditProduct = (productId) => {
        setEditingProductId(productId);
        setIsProductDrawerOpen(true);
    };

    const handleCloseProductDrawer = () => {
        setIsProductDrawerOpen(false);
        setTimeout(() => setEditingProductId(null), 300);
    };

    return (
        <div className="max-w-7xl mx-auto relative space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-8 px-2 sm:px-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">Catalogue Produits</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Gérez votre inventaire, vos prix et vos variantes.</p>
            </div>

            <div className="shadow-sm rounded-xl border border-gray-100 bg-white">
                <TableToolbar
                    searchTerm={state.searchQuery}
                    onSearchChange={actions.handleSearchChange}
                    searchPlaceholder="Rechercher un produit..."
                    actions={
                        <button
                            onClick={() => handleEditProduct('new')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Nouveau Produit
                        </button>
                    }
                />

                <AdminTable
                    headers={PRODUCT_HEADERS}
                    data={state.products}
                    emptyMessage={state.loading ? "Chargement des produits..." : "Aucun produit trouvé."}
                    renderRow={(product) => (
                        <ProductTableRow
                            key={product.id}
                            product={product}
                            onEdit={handleEditProduct}
                            onDelete={actions.requestDeleteProduct}
                            onAddVariant={setVariantProductId}
                        />
                    )}
                />
            </div>

            <ProductFormDrawer
                isOpen={isProductDrawerOpen}
                onClose={handleCloseProductDrawer}
                productId={editingProductId}
                onSuccess={actions.fetchProducts}
                onOpenVariantEdit={setEditingVariant}
            />

            <VariantFormDrawer
                isOpen={!!variantProductId}
                onClose={() => setVariantProductId(null)}
                productId={variantProductId}
                onSuccess={actions.fetchProducts}
            />

            <VariantEditDrawer
                isOpen={!!editingVariant}
                onClose={() => setEditingVariant(null)}
                variant={editingVariant}
                onSuccess={actions.fetchProducts}
            />

            <ConfirmDialog
                isOpen={!!state.productToDelete}
                onClose={actions.cancelDeleteProduct}
                onConfirm={actions.confirmDeleteProduct}
                title="Supprimer ce produit ?"
                message="Attention, cela supprimera également toutes les variantes, les stocks et les images associés à ce produit. Cette action est irréversible."
                confirmText="Oui, supprimer"
            />
        </div>
    );
};

export default ProductsAdmin;