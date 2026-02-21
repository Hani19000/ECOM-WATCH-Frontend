import AdminDrawer from '../../shared/AdminDrawer';
import { usePromotionFormLogic } from '../hooks/usePromotionFormLogic';

const SelectionCheckbox = ({ checked }) => (
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800'}`}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </div>
);

const VariantRow = ({ variant, isSelected, onToggle }) => {
    const label = [
        variant.attributes?.color,
        variant.attributes?.size,
    ].filter(Boolean).join(' · ') || variant.sku || 'Variante';

    const price = variant.price != null
        ? `${Number(variant.price).toLocaleString('fr-FR')} €`
        : null;

    return (
        <div
            onClick={() => onToggle(variant.id)}
            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b border-gray-100 dark:border-dark-border last:border-0 ${isSelected ? 'bg-blue-50/40 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
        >
            <SelectionCheckbox checked={isSelected} />
            <div className="flex items-center justify-between w-full min-w-0 gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{label}</span>
                {price && (
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">{price}</span>
                )}
            </div>
        </div>
    );
};

const ProductVariantsPanel = ({ entry, selectedVariantIds, onToggleVariant, onToggleAll }) => {
    const variantIds = entry.variants.map((v) => v.id);
    const selectedCount = variantIds.filter((id) => selectedVariantIds.includes(id)).length;
    const allSelected = selectedCount === variantIds.length;

    return (
        <div className="ml-7 mt-1 mb-2 border border-blue-100 dark:border-blue-900/30 rounded-xl overflow-hidden bg-white dark:bg-dark-card transition-colors">
            <div
                onClick={() => onToggleAll(variantIds)}
                className="flex items-center justify-between px-4 py-2 bg-blue-50/60 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors border-b border-blue-100 dark:border-blue-900/30"
            >
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                    Variantes
                </span>
                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-full">
                            {selectedCount}/{variantIds.length}
                        </span>
                    )}
                    <span className="text-[10px] text-blue-500 dark:text-blue-400 font-medium">
                        {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                    </span>
                </div>
            </div>

            {entry.variants.map((variant) => (
                <VariantRow
                    key={variant.id}
                    variant={variant}
                    isSelected={selectedVariantIds.includes(variant.id)}
                    onToggle={onToggleVariant}
                />
            ))}
        </div>
    );
};

export const PromotionFormDrawer = ({ isOpen, onClose, promoId, onSuccess }) => {
    const { state, actions } = usePromotionFormLogic(promoId, isOpen, onClose, onSuccess);
    const { formData, availableProducts, selectedProductIds, selectedVariantIds, variantsBySelectedProduct, loading, saving } = state;

    const totalVariantsSelected = selectedVariantIds.length;

    return (
        <AdminDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={promoId === 'new' ? 'Nouvelle Promotion' : 'Modifier la Promotion'}
        >
            {loading ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 animate-pulse font-medium text-sm">
                    Chargement des données...
                </div>
            ) : (
                <form onSubmit={actions.handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* ── Section Identité ─────────────────────────────── */}
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-[10px] uppercase tracking-wider transition-colors">
                                    Nom de la promotion
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={actions.handleInputChange}
                                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none"
                                    placeholder="Ex: Soldes d'Hiver"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-[10px] uppercase tracking-wider transition-colors">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={actions.handleInputChange}
                                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none"
                                    rows="2"
                                />
                            </div>
                        </div>

                        {/* ── Remise et Calendrier ─────────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-[10px] uppercase tracking-wider transition-colors">Type</label>
                                <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={actions.handleInputChange}
                                    className="w-full px-3 py-3 sm:py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 focus:border-gray-300 dark:focus:border-gray-500 outline-none transition-all"
                                >
                                    <option value="PERCENTAGE">Pourcentage (%)</option>
                                    <option value="FIXED">Montant Fixe (€)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-[10px] uppercase tracking-wider transition-colors">Valeur</label>
                                <input
                                    type="number"
                                    name="discountValue"
                                    step="0.01"
                                    required
                                    value={formData.discountValue}
                                    onChange={actions.handleInputChange}
                                    className="w-full px-3 py-3 sm:py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 focus:border-gray-300 dark:focus:border-gray-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-[10px] uppercase tracking-wider transition-colors">Début</label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    required
                                    value={formData.startDate}
                                    onChange={actions.handleInputChange}
                                    className="w-full px-3 py-3 sm:py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 focus:border-gray-300 dark:focus:border-gray-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-[10px] uppercase tracking-wider transition-colors">Fin</label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    required
                                    value={formData.endDate}
                                    onChange={actions.handleInputChange}
                                    className="w-full px-3 py-3 sm:py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 focus:border-gray-300 dark:focus:border-gray-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* ── Sélection Produits + Variantes ───────────────── */}
                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-dark-border transition-colors">
                            <div className="flex justify-between items-end">
                                <div>
                                    <label className="block font-bold text-gray-900 dark:text-white text-[10px] uppercase tracking-wider transition-colors">
                                        Produits &amp; Variantes cibles
                                    </label>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                        Sélectionnez un produit entier ou des variantes précises
                                    </p>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                    {selectedProductIds.length > 0 && (
                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full transition-colors">
                                            {selectedProductIds.length} produit{selectedProductIds.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {totalVariantsSelected > 0 && (
                                        <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full transition-colors">
                                            {totalVariantsSelected} variante{totalVariantsSelected > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Liste produits */}
                            <div className="border border-gray-200 dark:border-dark-border rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800/30 transition-colors">
                                {availableProducts.map((product) => {
                                    const isProductSelected = selectedProductIds.includes(product.id);
                                    const productEntry = variantsBySelectedProduct.find(
                                        (e) => e.productId === product.id
                                    );
                                    const hasVariants = (product.variantsPreview?.length ?? 0) > 0;

                                    return (
                                        <div key={product.id} className="border-b border-gray-100 dark:border-dark-border last:border-0 transition-colors">
                                            <div
                                                onClick={() => actions.toggleProduct(product.id)}
                                                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${isProductSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-white dark:hover:bg-dark-card'}`}
                                            >
                                                <SelectionCheckbox checked={isProductSelected} />
                                                <img
                                                    src={product.mainImage || '/placeholder.png'}
                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-dark-border shrink-0"
                                                    alt=""
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate transition-colors">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase transition-colors">
                                                        {product.status}
                                                        {hasVariants && (
                                                            <span className="ml-1.5 text-gray-300 dark:text-gray-600">
                                                                · {product.variantsPreview.length} variante{product.variantsPreview.length > 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {isProductSelected && productEntry && (
                                                <ProductVariantsPanel
                                                    entry={productEntry}
                                                    selectedVariantIds={selectedVariantIds}
                                                    onToggleVariant={actions.toggleVariant}
                                                    onToggleAll={actions.toggleAllVariantsForProduct}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Pied de page ─────────────────────────────────────── */}
                    <div className="p-4 border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-end gap-3 shrink-0 transition-colors">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs font-bold uppercase tracking-widest text-white dark:text-gray-900 bg-gray-900 dark:bg-white hover:bg-[#ADA996] dark:hover:bg-gray-200 rounded-xl disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {saving ? 'Sauvegarde...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            )}
        </AdminDrawer>
    );
};