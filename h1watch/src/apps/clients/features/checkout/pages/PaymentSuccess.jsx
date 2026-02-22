import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePaymentResult } from '../hooks/usePaymentResult';
import { useCart } from '../../cart/hooks/useCart';
import { CartBackupService } from '../../cart/api/Cartbackup.service';
import { GuestOrderService } from '../../orders/api/GuestOrder.service';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore';
import SEOHead from '../../../../../shared/SEO/SEOHead';

/**
 * Page de confirmation de commande (UI Pure + Orchestration de nettoyage).
 *
 * FIX STOCK :
 * Après un paiement réussi, le backend décrémente le stock en base.
 * Mais React Query conservait en cache les anciennes données produit (staleTime).
 * Résultat : la fiche produit continuait d'afficher l'ancien stock pendant
 * plusieurs minutes après l'achat.
 *
 * queryClient.invalidateQueries() force React Query à considérer toutes les
 * données ['products'] et ['product'] comme périmées. Au prochain affichage
 * d'une fiche produit ou du catalogue, une requête fraîche sera émise.
 */
const PaymentSuccess = () => {
    const { status, orderInfo } = usePaymentResult();
    const { clearCart, setIsDrawerOpen } = useCart();
    const { isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (status === 'success' && orderInfo) {
            // Persiste uniquement pour les guests (les users ont leur historique côté serveur)
            if (!isAuthenticated) {
                GuestOrderService.addOrder(orderInfo);
            }

            clearCart();
            CartBackupService.clear();

            // ── FIX STOCK : invalidation du cache React Query ─────────────────
            // Invalide toutes les requêtes produit pour que le stock s'actualise
            // dès la prochaine visite d'une fiche produit ou du catalogue.
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });
        }
    }, [status, orderInfo, clearCart, isAuthenticated, queryClient]);

    <SEOHead
        title="Commande confirmée | ECOM-WATCH"
        noIndex={true}
    />

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 py-16">
            {status === 'loading' && <LoadingState />}
            {status === 'success' && <SuccessState orderInfo={orderInfo} onOpenOrders={() => setIsDrawerOpen(true)} />}
            {status === 'error' && <VerificationErrorState onOpenCart={() => setIsDrawerOpen(true)} />}
        </div>
    );
};

/* DUMB COMPONENTS (UI States) */

const LoadingState = () => (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-[#ADA996]/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-[#ADA996] animate-spin" />
            <div className="absolute inset-3 rounded-full bg-white shadow-inner flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#ADA996]/60 animate-pulse" />
            </div>
        </div>
        <div className="text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ADA996]">Vérification en cours</p>
            <p className="text-xs text-gray-400 tracking-wide">Confirmation de votre paiement...</p>
        </div>
    </div>
);

const SuccessState = ({ orderInfo }) => (
    <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative mb-10">
            <div className="absolute inset-0 bg-[#ADA996]/10 blur-3xl rounded-full scale-150" />
            <div className="relative w-24 h-24 rounded-full bg-white border border-[#ADA996]/20 shadow-xl flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-[#ADA996]" strokeWidth={1.5} />
            </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ADA996] mb-4">Paiement Confirmé</p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-3 leading-tight">Merci pour votre commande</h1>
        <p className="text-sm text-gray-400 tracking-wide leading-relaxed mb-10 max-w-sm">
            Votre paiement a été accepté. Vous recevrez un email de confirmation avec le suivi de votre colis.
        </p>

        {orderInfo?.orderNumber && (
            <div className="w-full border border-gray-100 bg-white rounded-sm px-6 py-5 mb-10 flex items-center justify-between">
                <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1">Référence commande</p>
                    <p className="font-mono text-base font-bold text-gray-900 tracking-wider">#{orderInfo.orderNumber}</p>
                </div>
                <Package className="w-5 h-5 text-[#ADA996]" strokeWidth={1.5} />
            </div>
        )}

        <div className="w-full space-y-3">
            <Link to="/profile" className="w-full flex items-center justify-center gap-2 bg-black border border-black text-white py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black hover:border-[#ADA996] transition-all duration-300">
                Suivre ma commande <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/catalogue" className="w-full flex items-center justify-center py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-gray-900 transition-colors duration-300">
                Retour à l'accueil
            </Link>
        </div>
    </div>
);

const VerificationErrorState = ({ onOpenCart }) => (
    <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-700">
        <div className="relative mb-10">
            <div className="relative w-24 h-24 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-serif text-gray-400">?</span>
                </div>
            </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">Vérification impossible</p>
        <h1 className="text-3xl font-serif font-medium text-gray-900 mb-3">Confirmation en attente</h1>
        <p className="text-sm text-gray-400 tracking-wide leading-relaxed mb-10 max-w-sm">
            Si votre paiement a bien été effectué, votre commande apparaîtra dans votre historique sous quelques instants.
        </p>

        <div className="w-full space-y-3">
            <button onClick={onOpenCart} className="w-full flex items-center justify-center gap-2 bg-black border border-black text-white py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300">
                Voir mes commandes <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link to="/catalogue" className="w-full flex items-center justify-center py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-gray-900 transition-colors duration-300">
                Retour à l'accueil
            </Link>
        </div>
    </div>
);

export default PaymentSuccess;