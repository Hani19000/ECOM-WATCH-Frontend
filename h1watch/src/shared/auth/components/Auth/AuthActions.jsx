import { ArrowRight } from 'lucide-react';

const AuthActions = ({ isSubmitting, label, loadingLabel }) => (
    <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 text-white py-5 mt-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] 
                 hover:bg-[#ADA996] transition-all active:scale-95 flex items-center justify-center gap-3 
                 shadow-lg shadow-gray-200 disabled:opacity-50"
    >
        {isSubmitting ? loadingLabel : (
            <>
                {label} <ArrowRight className="w-4 h-4" />
            </>
        )}
    </button>
);

export default AuthActions;