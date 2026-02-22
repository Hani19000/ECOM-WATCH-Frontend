const ProductSkeleton = () => {
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-500">
            {/* Image skeleton */}
            <div className="relative h-80 bg-gray-100 overflow-hidden">
                <div className="shimmer-effect absolute inset-0" />
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded-full w-24 animate-pulse" />
                </div>

                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded-lg w-4/5 animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded-lg w-3/5 animate-pulse" />
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                    <div className="h-7 bg-gray-200 rounded-lg w-28 animate-pulse" />
                    <div className="h-11 w-11 bg-gray-200 rounded-full animate-pulse" />
                </div>
            </div>

            {/* Remplacement du <style jsx> par un <style> standard sans attribut invalide */}
            <style>{`
                .shimmer-effect {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite linear;
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
};

export default ProductSkeleton;