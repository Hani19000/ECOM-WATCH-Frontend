import { X, ShoppingBag } from "lucide-react";

export const CartDrawerHeader = ({ itemCount, onClose }) => (
    <div className="pt-14 pb-6 px-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center shadow-lg shadow-gray-200">
                <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Mon Panier</h2>
                <p className="text-[9px] text-[#ADA996] font-bold uppercase tracking-widest">
                    {itemCount} Sélection{itemCount > 1 ? 's' : ''}
                </p>
            </div>
        </div>
        <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-all active:scale-90"
            aria-label="Fermer le panier"
        >
            <X className="w-5 h-5 text-gray-400" />
        </button>
    </div>
);