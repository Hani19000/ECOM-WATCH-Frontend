import { ShoppingBag } from "lucide-react";

export const CartDrawerEmpty = () => (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
        <ShoppingBag className="w-16 h-16 mb-6 stroke-[1px]" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Votre sélection est vide</p>
    </div>
);