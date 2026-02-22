const ErrorMessage = ({ message, retryFn }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6">
            {/* Icône d'erreur élégante */}
            <div className="relative mb-6">
                {/* Effet de lueur rouge subtil */}
                <div className="absolute inset-0 bg-red-100 opacity-30 blur-2xl rounded-full" />

                <div className="relative bg-gradient-to-br from-red-50 to-white p-6 rounded-full border border-red-100 shadow-lg">
                    <svg
                        className="w-16 h-16 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
            </div>

            {/* Message d'erreur */}
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
                Une erreur est survenue
            </h3>

            <p className="text-sm text-gray-500 mb-8 max-w-md text-center tracking-wide">
                {message || "Impossible de charger les données. Veuillez réessayer."}
            </p>

            {/* Bouton réessayer */}
            {retryFn && (
                <button
                    onClick={() => retryFn()}
                    className="group px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
                >
                    <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Réessayer
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;