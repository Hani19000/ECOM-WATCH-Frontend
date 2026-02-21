import { useState, useEffect } from 'react';
import ProductService from '../apps/clients/features/products/api/product.service';
import ProductGrid from '../apps/clients/features/products/components/ProductGrid'
import featured from "../../public/images/featured.webp";
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariants, setSelectedVariants] = useState({});

    // Fonction de chargement liée au Service Layer
    const fetchFeatured = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ProductService.findFeatured();
            setProducts(data);
        } catch (err) {
            // On stocke le message pour éviter l'erreur de conversion d'objet
            setError(err.message || "Erreur lors de la récupération");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatured();
    }, []);

    const handleVariantChange = (productId, variant) => {
        setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
    };

    return (
        <div className="flex flex-col gap-8 md:gap-12 max-w-7xl mx-auto px-4 py-6 md:py-8">
            {/* HERO BANNER - Masqué sur mobile (< md), visible sur desktop (≥ md) */}
            <div className="hidden md:block -mx-4 md:mx-0">
                <div className="relative w-full overflow-hidden md:rounded-[40px] shadow-2xl">
                    <img src={featured} alt="Collection" className="w-full h-auto block object-cover" />
                </div>
            </div>

            {/* SECTION SÉLECTION ADMIN */}
            <main>
                <div className="mb-10">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                        La Sélection
                    </h3>
                    <div className="h-1 w-12 bg-[#ADA996] mt-2"></div>
                </div>

                <ProductGrid
                    products={products}
                    isLoading={isLoading}
                    isError={!!error}
                    error={error} // Ici error est déjà une string grâce au catch
                    refetch={fetchFeatured}
                    selectedVariants={selectedVariants}
                    onVariantChange={handleVariantChange}
                />
                <div className="flex justify-center mt-16 mb-8">
                    <Link
                        to="/catalogue"
                        className="group relative flex flex-col items-center gap-2"
                    >
                        {/* Conteneur Texte + Flèche */}
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
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>

                        {/* Ligne de soulignement animée */}
                        <div className="h-[1px] w-full max-w-[60px] bg-gray-200 overflow-hidden">
                            <div className="h-full w-full bg-black translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out"></div>
                        </div>

                        {/* Badge optionnel */}
                        <span className="text-[8px] text-gray-400 font-medium uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            {products.length}+ Modèles disponibles
                        </span>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Home;