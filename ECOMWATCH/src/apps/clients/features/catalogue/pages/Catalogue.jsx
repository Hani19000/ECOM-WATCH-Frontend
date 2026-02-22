import { useEffect } from 'react';
import { useCatalogueLogic } from '../hooks/useCatalogueLogic';
import ProductGrid from '../../products/components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import { CatalogueHeader } from '../components/CatalogueHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import SEOHead from '../../../../../shared/SEO/SEOHead';
import { buildCatalogueSchema } from '../../../../../shared/SEO/seoSchemas';
import { env } from '../../../../../core/config/env';

export default function Catalogue() {
    const { state, data, actions } = useCatalogueLogic();

    // Verrouillage du body lors de l'ouverture du drawer mobile
    useEffect(() => {
        document.body.style.overflow = state.isFiltersDrawerOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [state.isFiltersDrawerOpen]);

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

    const canonicalUrl = state.urlCategory !== 'all'
        ? `${env.CLIENT_URL}/catalogue?category=${state.urlCategory}`
        : `${env.CLIENT_URL}/catalogue`;

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

                    {/* * Drawer Mobile (Côté droit avec animation calquée sur CartDrawer)
                      * Le composant reste dans le DOM pour permettre la transition CSS.
                      */}
                    <>
                        {/* Backdrop */}
                        <div
                            className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${state.isFiltersDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                                }`}
                            onClick={() => actions.setIsFiltersDrawerOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Panel */}
                        <aside
                            className={`lg:hidden fixed top-0 right-0 h-full z-[101] 
                                w-[85%] sm:w-100 bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] 
                                rounded-l-[30px] sm:rounded-l-none flex flex-col
                                transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                                ${state.isFiltersDrawerOpen ? "translate-x-0" : "translate-x-full"}
                            `}
                        >
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
                    </>

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