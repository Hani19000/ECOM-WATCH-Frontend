import { useProductDetailLogic } from '../hooks/useProductDetailLogic';
import { ProductGallery } from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductActions from '../components/ProductActions';

const ProductDetail = () => {
    const {
        product, isLoading, isError,
        variants, activeVariant,
        setSelectedVariantState, handleAddToCart
    } = useProductDetailLogic();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-3">
                <div className="flex flex-col items-center gap-4 sm:gap-6">
                    <div className="relative">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-3 sm:border-4 border-gray-200 border-t-[#ADA996] rounded-full animate-spin" />
                        <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-3 sm:border-4 border-transparent border-t-[#ADA996]/30 rounded-full animate-spin animation-delay-150" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-400">
                        Identification de la pièce
                    </span>
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-4 sm:px-6">
                <div className="text-center space-y-4 sm:space-y-6 max-w-md">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900">
                            Pièce Introuvable
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-light px-4">
                            Cette référence n'existe pas dans notre collection
                        </p>
                    </div>
                    <button onClick={() => window.history.back()} className="group inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-widest hover:bg-[#ADA996] transition-all duration-300 active:scale-95">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour à la collection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-transparent">
            {/* Breadcrumb */}
            <div className="pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8 md:pb-10 px-3 sm:px-4 md:px-6 lg:px-12 max-w-[1400px] mx-auto">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-400">
                    <span className="hover:text-[#ADA996] transition-colors cursor-pointer">Accueil</span><span>/</span>
                    <span className="hover:text-[#ADA996] transition-colors cursor-pointer">Collection</span><span>/</span>
                    <span className="text-gray-900 font-bold truncate max-w-[150px] sm:max-w-none">{product.name}</span>
                </div>
            </div>

            <div className="px-3 sm:px-4 md:px-6 lg:px-12 pb-16 sm:pb-20 md:pb-24 max-w-[1400px] mx-auto">
                {/* Mobile View */}
                <div className="lg:hidden mb-8">
                    <div className="relative -mx-3 sm:mx-0">
                        {product.featured && (
                            <div className="absolute top-4 left-4 z-10">
                                <div className="bg-black/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Sélection</span>
                                </div>
                            </div>
                        )}
                        <ProductGallery mainImage={product.mainImage} activeVariantImage={activeVariant?.attributes?.image} />
                    </div>
                </div>

                <div className="lg:hidden space-y-6 mb-8">
                    <ProductInfo name={product.name} description={product.description} selectedVariant={activeVariant} />
                </div>

                <div className="lg:hidden mb-12">
                    <ProductActions variants={variants} selectedVariant={activeVariant} onVariantChange={setSelectedVariantState} onAddToCart={handleAddToCart} />
                </div>

                {/* Desktop View */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
                    <div className="relative">
                        {product.featured && (
                            <div className="absolute top-4 left-4 z-10">
                                <div className="bg-black/90 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em]">Sélection</span>
                                </div>
                            </div>
                        )}
                        <ProductGallery mainImage={product.mainImage} activeVariantImage={activeVariant?.attributes?.image} />
                    </div>

                    <div className="space-y-10">
                        <ProductInfo name={product.name} description={product.description} selectedVariant={activeVariant} />
                        <ProductActions name={product.name} variants={variants} selectedVariant={activeVariant} onVariantChange={setSelectedVariantState} onAddToCart={handleAddToCart} />

                        {/* Informations de service - Desktop uniquement */}
                        <div className="pt-8 space-y-4 border-t border-gray-200/50">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ADA996]/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-[#ADA996]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                </div>
                                <div><p className="text-sm font-semibold text-gray-900 mb-1">Emballage de luxe</p><p className="text-xs text-gray-500">Chaque pièce est livrée dans un écrin d'exception</p></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ADA996]/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-[#ADA996]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <div><p className="text-sm font-semibold text-gray-900 mb-1">Authenticité garantie</p><p className="text-xs text-gray-500">Certificat d'authenticité avec chaque montre</p></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#ADA996]/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-[#ADA996]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                </div>
                                <div><p className="text-sm font-semibold text-gray-900 mb-1">Paiement sécurisé</p><p className="text-xs text-gray-500">Transactions cryptées et protégées</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges de service - Mobile uniquement */}
                <div className="lg:hidden grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-transparent border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#ADA996]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#ADA996]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        </div>
                        <div><p className="text-xs font-semibold text-gray-900">Emballage de luxe</p><p className="text-[10px] text-gray-500">Écrin d'exception</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-transparent border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#ADA996]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#ADA996]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div><p className="text-xs font-semibold text-gray-900">Authenticité garantie</p><p className="text-[10px] text-gray-500">Certificat inclus</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-transparent border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#ADA996]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#ADA996]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        <div><p className="text-xs font-semibold text-gray-900">Paiement sécurisé</p><p className="text-[10px] text-gray-500">Transactions protégées</p></div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetail;