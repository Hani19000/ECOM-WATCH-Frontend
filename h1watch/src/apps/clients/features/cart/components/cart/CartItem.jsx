import { Trash2, Minus, Plus } from 'lucide-react';

const CartItem = ({ item, onUpdate, onRemove }) => {
    // Normalisation des données (Hybride API/Guest)
    const product = item.product || {};
    const variant = item.variant;
    const name = product.name;
    const image = variant?.image || product.images?.[0] || '/placeholder.jpg';
    const price = variant?.price || product.price || 0;

    // Identification unique pour les actions
    // En API: item._id ou item.id. En Guest: item.lineId
    const itemId = item._id || item.id || item.lineId;

    return (
        <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0 animate-fadeIn">
            <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{name}</h4>
                        <button
                            onClick={() => onRemove(itemId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    {variant && (
                        <p className="text-xs text-gray-500 mt-1">
                            {variant.name || `${variant.color} / ${variant.size}`}
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                            onClick={() => onUpdate(itemId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                            onClick={() => onUpdate(itemId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <span className="text-sm font-bold">
                        {(price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartItem;