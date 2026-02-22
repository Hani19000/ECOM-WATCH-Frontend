import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

import { CartDrawerHeader } from './CartDrawerHeader';
import { CartDrawerFooter } from './CartDrawerFooter';
import { CartDrawerEmpty } from './CartDrawerEmpty';
import { CartDrawerItem } from './CartDrawerItem';

const CartDrawer = () => {
    const {
        cart,
        isDrawerOpen,
        setIsDrawerOpen,
        totalPrice,
        removeFromCart,
        updateQuantity,
        hasOutOfStock,
        validateCart
    } = useCart();

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();

    // Verrouillage du body lors de l'ouverture
    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    const handleClose = () => setIsDrawerOpen(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        const isValid = await validateCart();

        if (!isValid) {
            setIsCheckingOut(false);
            toast.error("Le stock de votre panier a été mis à jour.");
            return;
        }

        setTimeout(() => {
            handleClose();
            setIsCheckingOut(false);
            navigate('/checkout');
        }, 500);
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={handleClose}
                aria-hidden="true"
            />

            <div className={`fixed top-0 right-0 h-full z-[101] 
                w-[75%] sm:w-[400px] md:w-[450px] 
                bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] 
                rounded-l-[30px] sm:rounded-l-none
                transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <CartDrawerHeader itemCount={cart.length} onClose={handleClose} />

                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide">
                        {cart.length === 0 ? (
                            <CartDrawerEmpty />
                        ) : (
                            cart.map((item) => (
                                <CartDrawerItem
                                    key={item.variantId}
                                    item={item}
                                    onUpdate={updateQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <CartDrawerFooter
                            totalPrice={totalPrice}
                            isCheckingOut={isCheckingOut}
                            hasOutOfStock={hasOutOfStock}
                            onCheckout={handleCheckout}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;