import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Package, FlaskConical } from 'lucide-react';
import { useCheckout } from '../hooks/useCheckout';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import SEOHead from '../../../../../shared/SEO/SEOHead';

/**
 * Bandeau d'avertissement affiché uniquement sur la page checkout.
 *
 * Informe l'utilisateur que le site est un projet de démonstration :
 * aucune vraie donnée bancaire ne doit être saisie, et les confirmations
 * par email sont désactivées (Resend exige un domaine vérifié).
 *
 * Composant pur — aucun état, aucun effet.
 */
const DemoDisclaimer = () => (
    <div className="mb-10 border border-[#ADA996]/40 bg-[#ADA996]/5 rounded-sm px-5 py-4">
        <div className="flex items-start gap-3">
            <FlaskConical
                className="w-4 h-4 text-[#ADA996] mt-0.5 shrink-0"
                strokeWidth={1.5}
                aria-hidden="true"
            />
            <div className="space-y-2.5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ADA996]">
                    Projet de démonstration
                </p>
                <ul className="space-y-1.5">
                    <DisclaimerLine>
                        Ce site est un projet personnel et fictif donc aucun achat réel ne sera effectué.
                    </DisclaimerLine>
                    <DisclaimerLine>
                        <strong className="text-gray-800 font-semibold">N'utilisez pas vos vraies coordonnées bancaires.</strong>
                        {' '}Pour tester le paiement Stripe, utilisez la carte de test{' '}
                        <span className="font-mono text-gray-700">4242 4242 4242 4242</span>,
                        une date future et n'importe quel CVC.
                    </DisclaimerLine>
                    <DisclaimerLine>
                        Les confirmations par email sont désactivées car Resend exige un nom de domaine
                        vérifié qui n'est pas encore configuré sur ce projet.
                    </DisclaimerLine>
                </ul>
            </div>
        </div>
    </div>
);

// Ligne de liste du disclaimer — évite de répéter la structure <li> partout.
const DisclaimerLine = ({ children }) => (
    <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed tracking-wide list-none">
        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#ADA996]/60 shrink-0" aria-hidden="true" />
        <span>{children}</span>
    </li>
);

/**
 * Orchestrateur principal de la page Checkout.
 * Lie l'état complexe (useCheckout) aux composants de présentation (CheckoutForm, OrderSummary).
 */
const CheckoutPage = () => {
    const {
        formData, cart, loading, loadingPricing, pricing,
        shippingOptions, selectedShippingMethod,
        handleInputChange, handleShippingMethodChange, handleSubmit
    } = useCheckout();

    // Protection anti-commande vide
    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-serif mb-4">Votre panier est vide</h2>
                <Link to="/catalogue" className="text-[#ADA996] underline underline-offset-4 hover:text-black transition-colors">
                    Retourner à la boutique
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* noIndex : page transactionnelle, ne doit pas être indexée */}
            <SEOHead
                title="Finaliser ma commande | ECOM-WATCH"
                description="Finalisez votre commande en toute sécurité."
                noIndex={true}
            />

            <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header Navigation */}
                    <div className="mb-10 flex items-center justify-between">
                        <Link to="/home" className="flex items-center text-gray-500 hover:text-black transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="text-sm uppercase tracking-wider">Retour à l'accueil</span>
                        </Link>
                        <div className="flex items-center text-[#ADA996] gap-2">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-widest">Paiement Sécurisé</span>
                        </div>
                    </div>

                    {/* Bandeau de démonstration — placé sous le header pour être visible
                        sans perturber la mise en page des colonnes */}
                    <DemoDisclaimer />

                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 items-start">

                        {/* COLONNE GAUCHE : Formulaire */}
                        <div className="lg:col-span-7">
                            <CheckoutForm
                                id="checkout-form"
                                formData={formData}
                                handleInputChange={handleInputChange}
                                shippingOptions={shippingOptions}
                                selectedShippingMethod={selectedShippingMethod}
                                onShippingMethodChange={handleShippingMethodChange}
                                onSubmit={handleSubmit}
                            />
                        </div>

                        {/* COLONNE DROITE : Résumé de commande avec pricing détaillé */}
                        <div className="lg:col-span-5 mt-10 lg:mt-0">
                            <OrderSummary
                                formId="checkout-form"
                                cart={cart}
                                pricing={pricing}
                                loading={loading}
                                loadingPricing={loadingPricing}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;