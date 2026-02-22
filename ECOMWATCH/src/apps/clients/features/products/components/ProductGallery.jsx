import { useProductGallery } from "../hooks/Useproductgallery";

/**
 * Boutons zoom desktop (+/−/reset)
 * Masqués sur mobile via hidden lg:flex
 */
const ZoomControlsDesktop = ({ zoomLabel, canZoomIn, canZoomOut, isZoomed, onZoomIn, onZoomOut, onReset }) => (
    <div className="hidden lg:flex absolute top-6 right-6 flex-col gap-2 z-10">
        <button
            onClick={(e) => { e.stopPropagation(); onZoomIn(); }}
            disabled={!canZoomIn}
            aria-label="Zoom avant"
            className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full border border-gray-200 shadow-sm hover:bg-white transition-all disabled:opacity-30"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </button>

        <div className="py-1 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 text-center shadow-sm" aria-live="polite">
            <span className="text-[9px] font-black tabular-nums">{zoomLabel}</span>
        </div>

        <button
            onClick={(e) => { e.stopPropagation(); onZoomOut(); }}
            disabled={!canZoomOut}
            aria-label="Zoom arrière"
            className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full border border-gray-200 shadow-sm hover:bg-white transition-all disabled:opacity-30"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
        </button>

        {isZoomed && (
            <button
                onClick={(e) => { e.stopPropagation(); onReset(); }}
                aria-label="Réinitialiser le zoom"
                className="w-10 h-10 mt-2 flex items-center justify-center bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
        )}
    </div>
);

/**
 * Bouton reset mobile — affiché uniquement quand zoomé
 * Visible uniquement sur mobile (lg:hidden)
 */
const ZoomResetMobile = ({ zoomLabel, onReset }) => (
    <button
        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onReset(); }}
        aria-label="Réinitialiser le zoom"
        className="lg:hidden absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 bg-black/75 backdrop-blur-md text-white rounded-full shadow-lg active:scale-95 transition-transform"
    >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-wider">{zoomLabel}</span>
    </button>
);

/**
 * Hint gestuel mobile — disparaît après 3s ou au premier usage
 * Visible uniquement sur mobile (lg:hidden)
 */
const MobileHint = () => (
    <div className="lg:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.845V17a2 2 0 01-2 2H5a2 2 0 01-2-2V8.845a1 1 0 011.447-.914L9 10m6 0V6a3 3 0 00-6 0v4m6 0H9" />
            </svg>
            <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest whitespace-nowrap">
                Pincez ou double-tapez
            </span>
        </div>
    </div>
);

/**
 * Badge signature de marque — masqué quand l'image est zoomée
 */
const BrandBadge = ({ visible }) => (
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 bg-white/90 backdrop-blur-xl rounded-full border border-gray-200/50 shadow-lg transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#ADA996] animate-pulse" aria-hidden="true" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-900">Haute Horlogerie</span>
        </div>
    </div>
);

/**
 * Invitation à explorer — desktop uniquement, visible quand zoomé
 */
const ExploreHintDesktop = () => (
    <div className="hidden lg:block absolute bottom-6 left-6 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full animate-in fade-in slide-in-from-bottom-2">
        <span className="text-[9px] text-white font-bold uppercase tracking-wider">Explorez les détails</span>
    </div>
);

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

/**
 * @component ProductGallery
 *
 * Composant d'affichage pur : aucune logique métier embarquée.
 * Toute l'interaction (zoom, pinch, double-tap, drag) est déléguée
 * au hook useProductGallery.
 *
 * @param {string} mainImage          - URL de l'image principale du produit
 * @param {string} activeVariantImage - URL de l'image de la variante sélectionnée
 */
export const ProductGallery = ({ mainImage, activeVariantImage }) => {
    const {
        containerRef,
        imageLoaded, setImageLoaded,
        zoomLevel, origin,
        showMobileHint,
        isZoomed, canZoomIn, canZoomOut, zoomLabel,
        handleMouseMove, handleClick,
        handleZoomIn, handleZoomOut, resetZoom,
    } = useProductGallery();

    const imageToShow = activeVariantImage || mainImage;

    return (
        <div className="group relative">
            {/* ─── Zone interactive principale ────────────────────────── */}
            <div
                ref={containerRef}
                className={`relative aspect-square overflow-hidden rounded-3xl md:rounded-[40px] bg-linear-to-br from-transparent to-gray-20/30 border border-gray-900 shadow-2xl shadow-gray-20/50 transition-all duration-500 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                role="img"
                aria-label={imageToShow ? "Image du produit — zoomable" : "Image non disponible"}
            >
                {/* Skeleton loader */}
                {!imageLoaded && imageToShow && (
                    <div className="absolute inset-0 animate-pulse bg-gray-100" aria-hidden="true" />
                )}

                {/* Image */}
                {imageToShow ? (
                    <div className="relative w-full h-full overflow-hidden">
                        <img
                            src={imageToShow}
                            alt="Détail du produit"
                            draggable={false}
                            className={`w-full h-full object-contain p-8 md:p-12 lg:p-16 transition-transform duration-200 ease-out select-none ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            style={{
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: `${origin.x}% ${origin.y}%`,
                                touchAction: 'none',
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

                {/* ─── Overlays conditionnels ──────────────────────────── */}
                {imageToShow && (
                    <>
                        <ZoomControlsDesktop
                            zoomLabel={zoomLabel}
                            canZoomIn={canZoomIn}
                            canZoomOut={canZoomOut}
                            isZoomed={isZoomed}
                            onZoomIn={handleZoomIn}
                            onZoomOut={handleZoomOut}
                            onReset={resetZoom}
                        />

                        {isZoomed && <ZoomResetMobile zoomLabel={zoomLabel} onReset={resetZoom} />}
                        {!isZoomed && showMobileHint && <MobileHint />}

                        <BrandBadge visible={!isZoomed} />

                        {isZoomed && <ExploreHintDesktop />}
                    </>
                )}
            </div>

            {/* ─── Décorations d'angle ─────────────────────────────────── */}
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#ADA996]/20 rounded-tr-2xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#ADA996]/20 rounded-bl-2xl pointer-events-none" aria-hidden="true" />
        </div>
    );
};