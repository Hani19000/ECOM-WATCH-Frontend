import { ShoppingBag } from "lucide-react";

export const CartDrawerEmpty = ({ onClose }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6" aria-hidden="true">
                <ShoppingBag className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-700 mb-3 text-center">
                Votre sélection est vide
            </p>

            <p className="text-xs text-gray-500 text-center max-w-[250px] mb-8 leading-relaxed font-light">
                Découvrez nos collections de montres et trouvez la pièce parfaite pour vous.
            </p>

            <button
                onClick={onClose}
                aria-label="Fermer le panier et découvrir la collection"
                className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors duration-300"
            >
                Découvrir la collection
            </button>
        </div>
    );
};