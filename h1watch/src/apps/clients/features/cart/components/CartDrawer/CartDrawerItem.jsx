import { Trash2, Minus, Plus } from "lucide-react";

export const CartDrawerItem = ({ item, onUpdate, onRemove }) => {
    return (
        <div className="flex gap-6 group animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-24 h-28 bg-[#F9F8F6] rounded-2xl overflow-hidden border border-gray-50 shrink-0 relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="font-black text-gray-900 text-[11px] md:text-xs uppercase tracking-tight leading-tight">
                            {item.name}
                        </h4>
                        <button
                            onClick={() => onRemove(item.variantId)}
                            aria-label={`Retirer ${item.name} du panier`}
                            className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                        >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                    </div>

                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mt-1.5">
                        {item.color}{item.size && <span className="mx-1 opacity-30" aria-hidden="true">|</span>}{item.size}
                    </p>

                    {item.isOutOfStock && (
                        <span className="inline-block mt-2 text-[7px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-50 px-2 py-1 rounded">
                            Indisponible
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div
                        className="flex items-center border border-gray-100 rounded-full p-1 bg-gray-50/50 shadow-inner"
                        role="group"
                        aria-label={`Quantité de ${item.name}`}
                    >
                        <button
                            onClick={() => onUpdate(item.variantId, -1)}
                            aria-label={`Diminuer la quantité de ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-all active:scale-90"
                        >
                            <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span
                            className="px-2 text-[10px] font-black w-7 text-center"
                            aria-live="polite"
                            aria-label={`Quantité : ${item.quantity}`}
                        >
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdate(item.variantId, 1)}
                            aria-label={`Augmenter la quantité de ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-all active:scale-90"
                        >
                            <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="flex flex-col items-end gap-0.5">
                        <span className="font-black text-xs tracking-tighter text-[#b4945d]">
                            {(item.price * item.quantity).toLocaleString()}€
                        </span>
                        {item.originalPrice && (
                            <span className="text-[9px] font-medium text-gray-400 line-through">
                                {(item.originalPrice * item.quantity).toLocaleString()}€
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};