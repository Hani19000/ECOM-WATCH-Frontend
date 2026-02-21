import { ShoppingBag } from "lucide-react";
import { useCart } from "../../features/cart/hooks/useCart";

const ShoppingCartIcon = () => {
    const { totalItems, setIsDrawerOpen } = useCart();

    return (
        <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative group p-2 transition-all active:scale-90"
            aria-label="Ouvrir le panier"
        >
            <ShoppingBag className="w-5 h-5 text-gray-800 group-hover:text-[#ADA996] transition-colors" />

            {totalItems > 0 && (
                <>
                    <span className="absolute -top-0.5 -right-0.5 animate-ping inline-flex h-4 w-4 rounded-full bg-[#ADA996] opacity-75"></span>

                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-black text-white border border-white group-hover:bg-[#ADA996] transition-colors z-10">
                        {totalItems}
                    </span>
                </>
            )}
        </button>
    );
};

export default ShoppingCartIcon;