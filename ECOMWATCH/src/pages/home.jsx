import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../apps/clients/features/products/hooks/useProducts';
import ProductGrid from '../apps/clients/features/products/components/ProductGrid';
import SEOHead from '../shared/SEO/SEOHead';
import { buildHomeSchema } from '../shared/SEO/seoSchemas';
import featured from '../../public/images/featured.webp';

const Home = () => {
    const { data: products = [], isLoading, isError, error, refetch } = useFeaturedProducts();

    // État local : la sélection de variant ne concerne que cette page
    const [selectedVariants, setSelectedVariants] = useState({});

    const handleVariantChange = (productId, variant) => {
        setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
    };

    return (
        <>
            <SEOHead
                title="ECOM-WATCH – Montres de Prestige | Haute Horlogerie"
                description="Découvrez notre sélection exclusive de montres de prestige. Haute horlogerie, éditions limitées, authenticité certifiée. Livraison sécurisée en France et en Europe."
                canonical="https://ecomwatch.vercel.app"
                image="https://ecomwatch.vercel.app/images/og-cover.jpg"
                imageAlt="Collection ECOM-WATCH – Montres de Haute Horlogerie"
                type="website"
                structuredData={buildHomeSchema(products)}
            />

            <div className="flex flex-col gap-8 md:gap-12 max-w-7xl mx-auto px-4 py-6 md:py-8">
                {/* HERO — visible uniquement sur desktop, préchargé via <link rel="preload"> dans index.html */}
                <div className="hidden md:block -mx-4 md:mx-0">
                    <div className="relative w-full overflow-hidden md:rounded-[40px] shadow-2xl">
                        <img
                            src={featured}
                            alt="Collection ECOM-WATCH – Montres de prestige et haute horlogerie"
                            className="w-full h-auto block object-cover"
                            fetchPriority="high"
                            loading="eager"
                            width="1400"
                            height="600"
                        />
                    </div>
                </div>

                {/* SÉLECTION FEATURED */}
                <main>
                    <div className="mb-10">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                            La Sélection
                        </h1>
                        <div className="h-1 w-12 bg-[#ADA996] mt-2" />
                    </div>

                    <ProductGrid
                        products={products}
                        isLoading={isLoading}
                        isError={isError}
                        error={error?.message}
                        refetch={refetch}
                        selectedVariants={selectedVariants}
                        onVariantChange={handleVariantChange}
                    />

                    <div className="flex justify-center mt-16 mb-8">
                        <Link to="/catalogue" className="group relative flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-900 group-hover:text-[#ADA996] transition-colors duration-300">
                                    <span className="inline md:hidden">Collection</span>
                                    <span className="hidden md:inline">Explorer la collection complète</span>
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 text-gray-900 group-hover:text-[#ADA996] group-hover:translate-x-1 transition-all duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                            <div className="h-px w-full max-w-15 bg-gray-200 overflow-hidden">
                                <div className="h-full w-full bg-black translate-x-full group-hover:translate-x-[0%] transition-transform duration-500 ease-out" />
                            </div>
                            <span className="text-[8px] text-gray-900 font-medium uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {products.length}+ Modèles disponibles
                            </span>
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Home;