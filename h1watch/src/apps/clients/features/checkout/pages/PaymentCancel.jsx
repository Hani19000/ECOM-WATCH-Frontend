import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import { useCartRestore } from '../../cart/hooks/useCartRestore';
import toast from 'react-hot-toast';
import SEOHead from '../../../../../shared/SEO/SEOHead';

// ─── Constante : durée de réservation du stock (en secondes) ─────────────────
const RESERVATION_DURATION_S = 30 * 60; // 30 minutes

/**
 * Hook de compte à rebours.
 *
 * Démarre un timer de 30 minutes dès que l'utilisateur arrive sur la page
 * d'annulation. Ce délai correspond à la durée de réservation du stock côté
 * backend (expiration de la session Stripe → webhook checkout.session.expired).
 * L'objectif est d'informer l'utilisateur qu'il peut réessayer sans risquer
 * de perdre son stock pendant cette fenêtre.
 */
const useReservationTimer = () => {
    const [secondsLeft, setSecondsLeft] = useState(RESERVATION_DURATION_S);

    useEffect(() => {
        const startTime = Date.now();

        const tick = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = RESERVATION_DURATION_S - elapsed;

            if (remaining <= 0) {
                setSecondsLeft(0);
                clearInterval(tick);
            } else {
                setSecondsLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(tick);
    }, []);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const isExpired = secondsLeft <= 0;
    const isUrgent = secondsLeft <= 5 * 60; // Dernières 5 minutes

    return { minutes, seconds, isExpired, isUrgent, secondsLeft };
};

// ─── Formatage du timer ───────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');

// ═════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════

const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const { isRestoring } = useCartRestore({
        autoRestore: true,
        onRestored: (items) => {
            toast.success(`Panier restauré — ${items.length} article${items.length > 1 ? 's' : ''} récupéré${items.length > 1 ? 's' : ''}`);
        },
    });

    return (
        <>
            <SEOHead title="Paiement annulé | ECOM-WATCH" noIndex={true} />

            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 py-16">
                {isRestoring ? (
                    <RestoringState />
                ) : (
                    <CancelContent orderId={orderId} />
                )}
            </div>
        </>
    );
};

// ─── État : restauration du panier en cours ───────────────────────────────────
const RestoringState = () => (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border border-gray-200" />
            <div className="absolute inset-0 rounded-full border-t border-[#ADA996] animate-spin" />
            <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[#ADA996] animate-spin" strokeWidth={1.5} />
            </div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400">
            Restauration de votre panier...
        </p>
    </div>
);

// ─── Contenu principal après restauration ────────────────────────────────────
const CancelContent = ({ orderId }) => {
    const { minutes, seconds, isExpired, isUrgent } = useReservationTimer();

    return (
        <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ── Icône principale ── */}
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-[#ADA996]/8 blur-3xl rounded-full scale-150" />
                <div className="relative w-24 h-24 rounded-full bg-white border border-[#ADA996]/20 shadow-xl flex items-center justify-center">
                    <Clock className="w-10 h-10 text-[#ADA996]" strokeWidth={1.2} />
                </div>
            </div>

            {/* ── Label statut ── */}
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#ADA996] mb-4">
                Paiement Interrompu
            </p>

            {/* ── Titre ── */}
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-3 leading-tight">
                Votre commande est<br />
                <span className="italic text-[#ADA996]">toujours réservée</span>
            </h1>

            <p className="text-sm text-gray-500 tracking-wide leading-relaxed mb-10 max-w-sm">
                Aucun montant n'a été prélevé. Le stock de votre commande vous est
                réservé — vous pouvez reprendre votre paiement à tout moment.
            </p>

            {/* ── Compte à rebours ── */}
            {!isExpired ? (
                <div className={`w-full border rounded-sm px-6 py-5 mb-10 transition-colors duration-500 ${isUrgent
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-[#ADA996]/20 bg-gradient-to-br from-white to-[#ADA996]/5'
                    }`}>
                    <p className={`text-[9px] font-black uppercase tracking-[0.35em] mb-3 ${isUrgent ? 'text-amber-500' : 'text-[#ADA996]'}`}>
                        Stock réservé encore
                    </p>
                    <div className="flex items-end justify-center gap-1.5 mb-3">
                        <TimerBlock value={pad(minutes)} label="min" urgent={isUrgent} />
                        <span className={`text-2xl font-mono font-bold pb-5 ${isUrgent ? 'text-amber-500' : 'text-[#ADA996]'}`}>:</span>
                        <TimerBlock value={pad(seconds)} label="sec" urgent={isUrgent} />
                    </div>
                    <p className="text-[10px] text-gray-400 tracking-wide">
                        Passé ce délai, le stock sera automatiquement libéré.
                    </p>
                </div>
            ) : (
                <div className="w-full border border-gray-200 bg-gray-50 rounded-sm px-6 py-5 mb-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-400 mb-1">
                        Réservation expirée
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        La période de réservation est écoulée. Le stock a pu être libéré.
                        Vérifiez la disponibilité avant de repasser votre commande.
                    </p>
                </div>
            )}

            {/* ── Encart sécurité ── */}
            <div className="w-full border border-gray-100 bg-white rounded-sm px-5 py-4 mb-10 flex items-start gap-3 text-left">
                <ShieldCheck className="w-4 h-4 text-[#ADA996] mt-0.5 shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-gray-500 leading-relaxed tracking-wide">
                    <strong className="text-gray-800 font-medium">Aucun débit effectué.</strong>
                    {' '}Votre commande reste en attente de paiement — elle n'a pas été annulée.
                    Vous pouvez réessayer dès maintenant.
                </p>
            </div>

            {/* ── CTAs ── */}
            <div className="w-full space-y-3">
                {/* Réessayer via le checkout (panier restauré) */}
                <Link
                    to="/checkout"
                    className="w-full flex items-center justify-center gap-2.5 bg-black border border-black text-white py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black hover:border-[#ADA996] transition-all duration-300"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Réessayer le paiement
                </Link>

                {/* Voir la commande dans le profil */}
                <Link
                    to={orderId ? `/profile?orderId=${orderId}` : '/profile'}
                    className="w-full flex items-center justify-center gap-2.5 border border-gray-200 text-gray-700 py-3.5 px-4 text-[10px] font-black uppercase tracking-[0.25em] hover:border-[#ADA996] hover:text-[#ADA996] transition-all duration-300"
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Voir ma commande
                </Link>

                <Link
                    to="/home"
                    className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-700 transition-colors duration-300"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Retour à l'accueil
                </Link>
            </div>

            {/* ── Séparateur décoratif ── */}
            <div className="mt-16 flex items-center gap-4 opacity-30">
                <span className="w-12 h-[1px] bg-[#ADA996]" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ADA996]">
                    ECOM-WATCH
                </p>
                <span className="w-12 h-[1px] bg-[#ADA996]" />
            </div>
        </div>
    );
};

// ─── Bloc chiffre du timer ────────────────────────────────────────────────────
const TimerBlock = ({ value, label, urgent }) => (
    <div className="flex flex-col items-center">
        <span className={`text-4xl font-mono font-black tabular-nums leading-none transition-colors duration-500 ${urgent ? 'text-amber-500' : 'text-gray-900'
            }`}>
            {value}
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mt-1">{label}</span>
    </div>
);

export default PaymentCancel;