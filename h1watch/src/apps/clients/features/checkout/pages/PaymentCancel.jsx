import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, RefreshCw } from 'lucide-react';
import { useCartRestore } from '../../cart/hooks/useCartRestore'
import toast from 'react-hot-toast';
import SEOHead from '../../../../../shared/SEO/SEOHead';


const PaymentCancel = () => {
    const { isRestoring, restoredCount } = useCartRestore({
        autoRestore: true,
        onRestored: (items) => {
            toast.info(`Panier restauré : ${items.length} articles`);
        }
    });

    <SEOHead
        title="Paiement annulé | ECOM-WATCH"
        noIndex={true}
    />

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 py-16">

            {/* ÉTAT : RESTAURATION EN COURS */}
            {isRestoring && (
                <RestoringState />
            )}

            {/* ÉTAT : RESTAURATION RÉUSSIE */}
            {/* ======================================================= */}
            {!isRestoring && restoredCount > 0 && (
                <RestoredState restoredCount={restoredCount} />
            )}

            {/* ÉTAT : AUCUN BACKUP (panier vide) */}
            {!isRestoring && restoredCount === 0 && (
                <EmptyState />
            )}

        </div>
    );
};


/* SOUS-COMPOSANTS D'ÉTAT */

/**
 * État de restauration - affiché pendant la récupération du backup.
 */
const RestoringState = () => (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
        <div className="relative w-24 h-24">
            {/* Animation de chargement */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-t-2 border-[#ADA996] animate-spin" />
            <div className="absolute inset-3 rounded-full bg-white shadow-inner flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[#ADA996] animate-spin" strokeWidth={1.5} />
            </div>
        </div>
        <div className="text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ADA996]">
                Restauration
            </p>
            <p className="text-xs text-gray-400 tracking-wide">
                Récupération de votre panier...
            </p>
        </div>
    </div>
);

/**
 * État de succès - panier restauré avec succès.
 */
const RestoredState = ({ restoredCount }) => (
    <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Icône de succès */}
        <div className="relative mb-10">
            <div className="absolute inset-0 bg-[#ADA996]/10 blur-3xl rounded-full scale-150" />
            <div className="relative w-24 h-24 rounded-full bg-white border border-[#ADA996]/20 shadow-xl flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-[#ADA996]" strokeWidth={1.5} />
            </div>
        </div>

        {/* Label statut */}
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ADA996] mb-4">
            Paiement Annulé
        </p>

        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-3 leading-tight">
            Panier restauré
        </h1>

        <p className="text-sm text-gray-400 tracking-wide leading-relaxed mb-10 max-w-sm">
            Aucun montant n'a été prélevé. Vos {restoredCount} article{restoredCount > 1 ? 's ont été remis' : ' a été remis'} dans votre panier.
        </p>

        {/* Encart informatif */}
        <div className="w-full border border-[#ADA996]/20 bg-gradient-to-br from-white to-[#ADA996]/5 rounded-sm px-6 py-5 mb-10">
            <div className="flex items-start gap-3">
                <div className="w-1 h-full min-h-[2rem] bg-[#ADA996]/40 rounded-full shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed text-left tracking-wide">
                    <strong className="text-gray-900">Vos articles sont sauvegardés.</strong>
                    <br />
                    Vous pouvez finaliser votre achat à tout moment dans les prochaines 24 heures.
                </p>
            </div>
        </div>

        {/* CTAs */}
        <div className="w-full space-y-3">
            <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-black border border-black text-white py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black hover:border-[#ADA996] transition-all duration-300"
            >
                <ShoppingBag className="w-3.5 h-3.5" />
                Finaliser ma commande
            </Link>

            <Link
                to="/catalogue"
                className="w-full flex items-center justify-center py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-gray-900 transition-colors duration-300"
            >
                Continuer mes achats
            </Link>

            <Link
                to="/home"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-gray-900 transition-colors duration-300"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour à l'accueil
            </Link>
        </div>

        {/* Ligne décorative */}
        <div className="mt-16 flex items-center gap-4 opacity-40">
            <span className="w-12 h-[1px] bg-[#ADA996]" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ADA996]">
                H1 Watch
            </p>
            <span className="w-12 h-[1px] bg-[#ADA996]" />
        </div>
    </div>
);

/**
 * État vide - aucun backup disponible.
 * Cas d'usage : backup expiré ou annulation sans panier.
 */
const EmptyState = () => (
    <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-700">

        <div className="relative mb-10">
            <div className="relative w-24 h-24 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
            </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">
            Paiement Annulé
        </p>

        <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-3 leading-tight">
            Votre panier est vide
        </h1>

        <p className="text-sm text-gray-400 tracking-wide leading-relaxed mb-10 max-w-sm">
            Aucun montant n'a été prélevé. Explorez notre collection pour composer votre sélection.
        </p>

        <div className="w-full space-y-3">
            <Link
                to="/catalogue"
                className="w-full flex items-center justify-center gap-2 bg-black border border-black text-white py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black hover:border-[#ADA996] transition-all duration-300"
            >
                <ShoppingBag className="w-3.5 h-3.5" />
                Découvrir le catalogue
            </Link>

            <Link
                to="/home"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-gray-900 transition-colors duration-300"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour à l'accueil
            </Link>
        </div>
    </div>
);

export default PaymentCancel;