import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * ProductGallery
 * Gère l'affichage et le zoom interactif des produits.
 * Résout le problème de scroll de page parasite via un listener natif non-passif.
 * Intègre le support complet des gestes tactiles (mobile/tablette).
 */
export const ProductGallery = ({ mainImage, activeVariantImage }) => {
    // --- ÉTAT ---
    const [imageLoaded, setImageLoaded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const containerRef = useRef(null);

    // --- CONFIGURATION ---
    const ZOOM_LEVELS = [1, 1.5, 2, 2.5, 3];
    const MIN_ZOOM = ZOOM_LEVELS[0];
    const MAX_ZOOM = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
    const ZOOM_STEP = 0.3; // Pas de zoom pour la molette (plus fluide que 0.5)

    const imageToShow = activeVariantImage || mainImage;
    const isZoomed = zoomLevel > 1;

    // --- LOGIQUE DE ZOOM (Service Layer Pattern interne) ---

    const handleResetZoom = useCallback(() => {
        setZoomLevel(1);
        setMousePosition({ x: 50, y: 50 });
    }, []);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(MAX_ZOOM, prev + 0.5));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(MIN_ZOOM, prev - 0.5));

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleNativeWheel = (e) => {
            // Bloque systématiquement le scroll de la page quand on est sur l'image
            e.preventDefault();

            // Calcul du nouveau zoom
            const direction = e.deltaY > 0 ? -1 : 1;
            setZoomLevel(prev => {
                const nextZoom = prev + (direction * ZOOM_STEP);
                return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
            });
        };

        // L'option { passive: false } est CRUCIALE pour que e.preventDefault() fonctionne
        container.addEventListener('wheel', handleNativeWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleNativeWheel);
        };
    }, [MAX_ZOOM, MIN_ZOOM]);

    // --- GESTION DU FOCUS (Desktop & Mobile) ---

    // Fonction utilitaire pour calculer le point de focus (souris ou doigt)
    const updateFocusPoint = (clientX, clientY, currentTarget) => {
        const rect = currentTarget.getBoundingClientRect();
        // Math.max et Math.min empêchent l'image de sortir du cadre sur les bords
        const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
        setMousePosition({ x, y });
    };

    // Suivi du curseur (Desktop)
    const handleMouseMove = (e) => {
        if (!isZoomed) return;
        updateFocusPoint(e.clientX, e.clientY, e.currentTarget);
    };

    // Suivi du glissement de doigt (Mobile)
    const handleTouchMove = (e) => {
        if (!isZoomed || e.touches.length === 0) return;
        updateFocusPoint(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    };

    // Début du toucher (évite un "saut" de l'image quand on pose le doigt)
    const handleTouchStart = (e) => {
        if (!isZoomed || e.touches.length === 0) return;
        updateFocusPoint(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    };

    return (
        <div className="group relative">
            {/* Conteneur Principal */}
            <div
                ref={containerRef}
                className={`relative aspect-square overflow-hidden rounded-3xl md:rounded-[40px] bg-linear-to-br from-transparent to-gray-20/30 border border-gray-900 shadow-2xl shadow-gray-20/50 transition-all duration-500 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                // L'astuce vitale pour l'UX mobile : empêche la page de scroller quand on explore l'image zoomée
                style={{ touchAction: isZoomed ? 'none' : 'auto' }}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
                onClick={() => isZoomed && handleResetZoom()}
            >
                {/* Skeleton Loader */}
                {!imageLoaded && imageToShow && (
                    <div className="absolute inset-0 animate-pulse bg-gray-100" />
                )}

                {/* Rendu Image */}
                {imageToShow ? (
                    <div className="relative w-full h-full overflow-hidden">
                        <img
                            src={imageToShow}
                            alt="Détail du produit"
                            className={`w-full h-full object-contain p-8 md:p-12 lg:p-16 transition-transform duration-300 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                            }}
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x600/F5F5F4/ADA996?text=Image+Indisponible';
                                setImageLoaded(true);
                            }}
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <span className="text-[10px] uppercase tracking-widest">Image non disponible</span>
                    </div>
                )}

                {/* Interface de Contrôle (Zoom) */}
                {imageToShow && (
                    <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                            disabled={zoomLevel >= MAX_ZOOM}
                            className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full border border-gray-200 shadow-sm hover:bg-white transition-all disabled:opacity-30"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        <div className="py-1 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 text-center shadow-sm">
                            <span className="text-[9px] font-black tabular-nums">{zoomLevel.toFixed(1)}x</span>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                            disabled={zoomLevel <= MIN_ZOOM}
                            className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full border border-gray-200 shadow-sm hover:bg-white transition-all disabled:opacity-30"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>

                        {isZoomed && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                                className="w-10 h-10 mt-2 flex items-center justify-center bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Badges et Indications UX */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 bg-white/90 backdrop-blur-xl rounded-full border border-gray-200/50 shadow-lg transition-all duration-500 ${isZoomed ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#ADA996] animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-900">Haute Horlogerie</span>
                    </div>
                </div>

                {isZoomed && (
                    <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-[9px] text-white font-bold uppercase tracking-wider">Explorez les détails</span>
                    </div>
                )}
            </div>

            {/* Décorations d'angle */}
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#ADA996]/20 rounded-tr-2xl pointer-events-none" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#ADA996]/20 rounded-bl-2xl pointer-events-none" />
        </div>
    );
};