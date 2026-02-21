const FormActions = ({ isSubmitting, isValid }) => (
    <div className="pt-4 border-t border-gray-200">
        <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg
                     hover:bg-[#ADA996] disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-all duration-300 flex items-center justify-center gap-2"
        >
            {isSubmitting ? (
                <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Modification en cours...
                </>
            ) : (
                'Changer le mot de passe'
            )}
        </button>
        <p className="mt-4 text-center text-[12px] uppercase tracking-tighter text-black">
            Protection active : limite de 3 tentatives par quart d'heure
        </p>
    </div>
);

export default FormActions;