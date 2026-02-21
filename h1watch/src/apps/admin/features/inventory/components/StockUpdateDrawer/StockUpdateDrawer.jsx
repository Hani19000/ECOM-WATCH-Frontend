import { Package } from 'lucide-react';
import { useStockUpdateLogic } from '../../hooks/useStockUpdateLogic';
import AdminDrawer from '../../../shared/AdminDrawer';

const StockUpdateDrawer = ({ isOpen, onClose, item, isUpdating, onAdjust, onRestock }) => {
    const { mode, setMode, quantity, setQuantity, reason, setReason, errors, handleSubmit } = useStockUpdateLogic(item, onAdjust, onRestock, onClose);

    if (!item) return null;

    const productName = item.productName || item.product_name || 'Produit inconnu';
    const availableStock = Number(item.availableStock ?? item.available_stock ?? 0);
    const reservedStock = Number(item.reservedStock ?? item.reserved_stock ?? 0);

    const headerBadges = (
        <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 text-xs font-bold shadow-sm transition-colors">
                <Package className="w-3.5 h-3.5 mr-1.5 text-gray-400 dark:text-gray-500 shrink-0" />
                Disponible : {availableStock}
            </span>
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs font-bold border border-transparent transition-colors">
                Réservé : {reservedStock}
            </span>
        </div>
    );

    const footerButton = (
        <button
            type="button"
            onClick={handleSubmit}
            disabled={isUpdating}
            className="w-full py-3.5 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors shadow-lg shadow-gray-900/20 dark:shadow-none"
        >
            {isUpdating ? 'Mise à jour...' : 'Confirmer'}
        </button>
    );

    return (
        <AdminDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={productName}
            subtitle={`SKU: ${item.sku}`}
            headerContent={headerBadges}
            footer={footerButton}
        >
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest transition-colors">Type d'opération</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setMode('restock')}
                            className={`py-3.5 sm:py-3 px-4 text-xs font-bold uppercase tracking-wide rounded-lg border transition-all ${mode === 'restock'
                                ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                                : 'border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            Réassort (+)
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('adjust')}
                            className={`py-3.5 sm:py-3 px-4 text-xs font-bold uppercase tracking-wide rounded-lg border transition-all ${mode === 'adjust'
                                ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                                : 'border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            Ajustement (+/-)
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest transition-colors">
                        {mode === 'restock' ? 'Quantité reçue *' : 'Correction de quantité *'}
                    </label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-dark-card focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all"
                        placeholder={mode === 'restock' ? "Ex: 50" : "Ex: -5 ou 10"}
                    />
                    {errors.quantity && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.quantity}</p>}
                </div>

                {mode === 'adjust' && (
                    <div className="space-y-1.5 animate-fadeIn">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest transition-colors">Raison de l'ajustement</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="w-full p-3 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-dark-card focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 resize-none transition-all"
                            placeholder="Ex: Casse, perte, inventaire physique..."
                        />
                        {errors.reason && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.reason}</p>}
                    </div>
                )}
            </form>
        </AdminDrawer>
    );
};

export default StockUpdateDrawer;