import { useCatalogueLogic } from '../hooks/useCatalogueLogic';
import ProductGrid from '../../products/components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import { CatalogueHeader } from '../components/CatalogueHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import SEOHead from '../../../../../shared/SEO/SEOHead';
import { buildCatalogueSchema } from '../../../../../shared/SEO/seoSchemas';

const BASE_URL = 'https://ecom-watch.fr';

export default function Catalogue() {
    const { state, data, actions } = useCatalogueLogic();

    const seoTitle = state.urlSearch
        ? `"${state.urlSearch}" – Montres | ECOM-WATCH`
        : state.urlCategory !== 'all'
            ? `${state.activeCategoryName} – Montres de Prestige | ECOM-WATCH`
            : 'Catalogue – Collection Complète Montres de Prestige | ECOM-WATCH';

    const seoDescription = state.urlSearch
        ? `Résultats pour "${state.urlSearch}" dans notre collection de montres de prestige. ${data.filteredProducts.length} modèle(s) disponible(s).`
        : state.urlCategory !== 'all'
            ? `Découvrez notre sélection de montres ${state.activeCategoryName.toLowerCase()}. Authenticité certifiée, garantie 2 ans, livraison sécurisée.`
            : `Explorez notre collection complète de ${data.filteredProducts.length} montres de prestige. Haute horlogerie, éditions limitées, authenticité garantie.`;

    /*
     * L'URL canonique ignore volontairement les paramètres de prix ou de recherche.
     * Prévient la dilution du budget de crawl SEO (Duplicate Content).
     */
    const canonicalUrl = state.urlCategory !== 'all'
        ? `${BASE_URL}/catalogue?category=${state.urlCategory}`
        : `${BASE_URL}/catalogue`;

    const shouldNoIndex = state.urlMinPrice > state.dataMinPrice || state.urlMaxPrice < state.dataMaxPrice;

    return (
        <>
            <SEOHead
                title={seoTitle}
                description={seoDescription}
                canonical={canonicalUrl}
                type="website"
                noIndex={shouldNoIndex}
                structuredData={buildCatalogueSchema(
                    data.filteredProducts,
                    state.activeCategoryName,
                    state.urlSearch
                )}
            />

            <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12 pt-20 sm:pt-24 md:pt-28 min-h-screen">
                <CatalogueHeader
                    activeCategoryName={state.activeCategoryName}
                    isAll={state.urlCategory === 'all'}
                    productsCount={data.filteredProducts.length}
                    isLoading={data.isProductsLoading}
                    hasActiveFilters={state.hasActiveFilters}
                    onOpenFilters={() => actions.setIsFiltersDrawerOpen(true)}
                />

                <CategoryTabs
                    tabs={state.categoryTabs}
                    activeSlug={state.urlCategory}
                    isLoading={data.isCatsLoading}
                    onSelect={actions.handleCategoryChange}
                />

                <main className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
                    {/* Sidebar Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0" aria-label="Filtres produits">
                        <div className="sticky top-32">
                            <ProductFilters
                                filters={{
                                    search: state.urlSearch,
                                    category: state.urlCategory,
                                    minPrice: state.urlMinPrice,
                                    maxPrice: state.urlMaxPrice,
                                }}
                                onFilterChange={actions.updateFilters}
                                categories={state.categoryTabs.filter(c => c.slug !== 'all')}
                                priceRange={{ min: state.dataMinPrice, max: state.dataMaxPrice }}
                                priceSegments={state.segments}
                            />
                        </div>
                    </aside>

                    {/* Drawer Mobile (Côté droit) */}
                    {state.isFiltersDrawerOpen && (
                        <div className="lg:hidden fixed inset-0 z-50 flex justify-end overflow-hidden">
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                                onClick={() => actions.setIsFiltersDrawerOpen(false)}
                                aria-hidden="true"
                            />

                            {/* Panel */}
                            <aside className="relative w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                                        Filtres
                                    </h2>
                                    <button
                                        onClick={() => actions.setIsFiltersDrawerOpen(false)}
                                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Fermer les filtres"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar">
                                    <ProductFilters
                                        filters={{
                                            search: state.urlSearch,
                                            category: state.urlCategory,
                                            minPrice: state.urlMinPrice,
                                            maxPrice: state.urlMaxPrice,
                                        }}
                                        onFilterChange={actions.updateFilters}
                                        categories={state.categoryTabs.filter(c => c.slug !== 'all')}
                                        priceRange={{ min: state.dataMinPrice, max: state.dataMaxPrice }}
                                        priceSegments={state.segments}
                                        isMobile={true}
                                    />
                                </div>
                            </aside>
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <ProductGrid
                            products={data.filteredProducts}
                            isLoading={data.isProductsLoading}
                            isError={data.isError}
                            error={data.error}
                            refetch={actions.refetch}
                            selectedVariants={state.selectedVariants}
                            onVariantChange={actions.handleVariantChange}
                            variant="catalogue"
                        />
                    </div>
                </main>
            </div>
        </>
    );
}