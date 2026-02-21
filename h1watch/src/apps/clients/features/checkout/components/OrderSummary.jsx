import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PricingRow = ({ label, value, loading, isTotal }) => (
    <div className={`flex items-center justify-between ${isTotal ? 'border-t border-gray-100 pt-4 mt-4' : 'text-sm'}`}>
        <span className={isTotal ? 'text-base font-medium text-gray-900' : 'text-gray-600'}>{label}</span>
        {loading ? (
            <div className="h-5 w-16 bg-gray-100 animate-pulse rounded" />
        ) : (
            <span className={isTotal ? 'text-xl font-bold text-gray-900 font-mono' : 'font-medium text-gray-900'}>
                {value}
            </span>
        )}
    </div>
);

const OrderSummary = ({ cart, pricing, loading, loadingPricing, formId }) => {
    return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-serif font-medium text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Votre Commande
            </h2>

            {/* Liste Produits */}
            <ul className="divide-y divide-gray-100 mb-6 max-h-75 overflow-y-auto pr-2 scrollbar-thin">
                {cart.map((item, i) => (
                    <li key={`${item.id}-${i}`} className="flex py-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-gray-200">
                            <img src={item.image || item.product?.images?.[0]} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col justify-center">
                            <div className="flex justify-between text-sm font-medium text-gray-900 gap-2">
                                <h3 className="font-serif line-clamp-1">{item.name}</h3>
                                <div className="flex flex-col items-end shrink-0">
                                    <p className={`font-mono text-sm ${item.originalPrice ? 'text-[#b4945d]' : 'text-gray-900'}`}>
                                        {(item.price * item.quantity).toFixed(2)} €
                                    </p>
                                    {item.originalPrice && (
                                        <p className="font-mono text-xs text-gray-400 line-through">
                                            {(item.originalPrice * item.quantity).toFixed(2)} €
                                        </p>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Qté: {item.quantity}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pricing */}
            <div className="space-y-3">
                <PricingRow
                    label="Sous-total HT"
                    value={`${pricing.subtotal.toFixed(2)} €`}
                    loading={loadingPricing}
                />
                <PricingRow
                    label="Livraison"
                    value={pricing.shipping.isFree ? <span className="text-green-600 font-bold uppercase text-xs">Gratuite</span> : `${pricing.shipping.cost.toFixed(2)} €`}
                    loading={loadingPricing}
                />
                <PricingRow
                    label={`TVA (${pricing.tax.rate}%)`}
                    value={`${pricing.tax.amount.toFixed(2)} €`}
                    loading={loadingPricing}
                />
                <PricingRow
                    label="Total TTC"
                    value={`${pricing.total.toFixed(2)} €`}
                    loading={loadingPricing}
                    isTotal
                />
            </div>

            <button
                type="submit"
                form={formId}
                disabled={loading || loadingPricing}
                className="w-full mt-8 bg-black border border-black text-white py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-[#ADA996] transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Traitement...' : 'Payer maintenant'}
            </button>

            <div className="mt-4 flex justify-center items-center gap-2 text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wide">Paiement 100% Sécurisé</span>
            </div>
        </div>
    );
};

export default OrderSummary;