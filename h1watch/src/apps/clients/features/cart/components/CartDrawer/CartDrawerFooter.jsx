export const CartDrawerFooter = ({ totalPrice, onCheckout, isCheckingOut, hasOutOfStock }) => (
    <div className="p-8 md:p-10 border-t border-gray-50 bg-[#FDFDFD] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-end mb-8">
            <div>
                <p className="text-[9px] font-black uppercase text-[#ADA996] tracking-[0.2em] mb-1.5">Total Estimé</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{totalPrice.toLocaleString()}€</p>
            </div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest pb-1.5 italic">Signature incluse</p>
        </div>

        <button
            onClick={onCheckout}
            disabled={isCheckingOut || hasOutOfStock}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 relative overflow-hidden group/btn
            ${isCheckingOut || hasOutOfStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-[#ADA996] shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-[0.98]"
                }`}
        >
            {isCheckingOut ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
            ) : hasOutOfStock ? (
                "Ajuster la sélection"
            ) : (
                "Finaliser la commande"
            )}
        </button>

        <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-[#ADA996]">
                <span className="w-3 h-[1px] bg-[#ADA996]/30"></span>
                <p className="text-[8px] font-black uppercase tracking-[0.2em]">Paiement 100% Sécurisé</p>
                <span className="w-3 h-[1px] bg-[#ADA996]/30"></span>
            </div>
            <div className="flex items-center justify-center gap-4 opacity-40 grayscale">
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Visa</p>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Mastercard</p>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Amex</p>
            </div>
        </div>
    </div>
);