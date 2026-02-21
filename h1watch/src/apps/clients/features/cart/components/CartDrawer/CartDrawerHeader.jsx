import { X, ShoppingBag } from "lucide-react";

/**
 * Composant d'en-tête du tiroir panier.
 * Affiche le titre et le compteur d'articles.
 */
export const CartDrawerHeader = ({ itemCount, onClose }) => {
    return (
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <div className="flex flex-col">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                        Mon Panier
                    </h2>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                        {itemCount} Sélection{itemCount !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <button
                onClick={onClose}
                aria-label="Fermer le panier"
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-full"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};