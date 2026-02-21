import { useCatalogueLogic } from '../hooks/useCatalogueLogic';
import ProductGrid from '../../products/components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import { CatalogueHeader } from '../components/CatalogueHeader';
import { CategoryTabs } from '../components/CategoryTabs';

const Catalogue = () => {
    const { state, data, actions } = useCatalogueLogic();

    return (
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
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-72 flex-shrink-0">
                    <div className="sticky top-32">
                        <ProductFilters
                            filters={{
                                search: state.urlSearch, category: state.urlCategory,
                                minPrice: state.urlMinPrice, maxPrice: state.urlMaxPrice
                            }}
                            onFilterChange={actions.updateFilters}
                            categories={state.categoryTabs.filter(c => c.slug !== 'all')}
                            priceRange={{ min: state.dataMinPrice, max: state.dataMaxPrice }}
                            priceSegments={state.segments}
                        />
                    </div>
                </aside>

                {/* Mobile Drawer (À extraire idéalement dans un CatalogueMobileDrawer.jsx) */}
                {state.isFiltersDrawerOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => actions.setIsFiltersDrawerOpen(false)} />
                        <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slideUp">
                            <ProductFilters
                                filters={{ search: state.urlSearch, category: state.urlCategory, minPrice: state.urlMinPrice, maxPrice: state.urlMaxPrice }}
                                onFilterChange={actions.updateFilters}
                                categories={state.categoryTabs.filter(c => c.slug !== 'all')}
                                priceRange={{ min: state.dataMinPrice, max: state.dataMaxPrice }}
                                priceSegments={state.segments}
                                isMobile={true}
                            />
                        </div>
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
    );
};

export default Catalogue;