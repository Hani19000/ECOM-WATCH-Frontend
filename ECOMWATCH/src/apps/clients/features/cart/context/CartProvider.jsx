import { CartContext } from './CartContext';
import { useAuth } from '../../../../../shared/auth/hooks/useAuth';
import { useCartLogic } from '../hooks/useCartLogic';

/**
 * Isole les paniers via cartKey et distribue la logique métier.
 */
export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const cartKey = user ? `h1-cart-${user.id}` : 'h1-cart-guest';

    return (
        <CartProviderInner key={cartKey} cartKey={cartKey}>
            {children}
        </CartProviderInner>
    );
};

const CartProviderInner = ({ children, cartKey }) => {
    const cartLogic = useCartLogic(cartKey);

    return (
        <CartContext.Provider value={cartLogic}>
            {children}
        </CartContext.Provider>
    );
};