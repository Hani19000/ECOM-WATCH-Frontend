import { useState } from 'react';

/**
 * @component GuestSearchForm
 *
 * Formulaire de recherche par numéro de commande + email.
 * Responsabilité unique : collecter et valider les entrées utilisateur,
 * puis déléguer la recherche au callback `onSubmit`.
 *
 * La validation côté client complète (pas remplace) la validation serveur.
 * Elle protège contre la soumission accidentelle, pas contre les attaques.
 */

const ORDER_NUMBER_PATTERN = /^ORD-\d{4}-\d{6}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GuestSearchForm = ({ onSubmit }) => {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [validationError, setValidationError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError(null);

        const trimmedOrderNumber = orderNumber.trim().toUpperCase();
        const trimmedEmail = email.trim().toLowerCase();

        if (!ORDER_NUMBER_PATTERN.test(trimmedOrderNumber)) {
            setValidationError('Format invalide. Exemple : ORD-2024-123456');
            return;
        }

        if (!EMAIL_PATTERN.test(trimmedEmail)) {
            setValidationError('Adresse email invalide.');
            return;
        }

        // La sanitisation (trim + normalize) est faite avant d'envoyer.
        // Le service backend refait sa propre validation — la double validation
        // est intentionnelle : defense in depth.
        onSubmit(trimmedOrderNumber, trimmedEmail);
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
                <label
                    htmlFor="orderNumber"
                    className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2"
                >
                    Numéro de commande
                </label>
                <input
                    id="orderNumber"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="ORD-2024-123456"
                    maxLength={16}
                    autoComplete="off"
                    className="w-full border-b border-gray-200 pb-2 text-sm font-mono text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2"
                >
                    Email utilisé lors de la commande
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    maxLength={254}
                    autoComplete="email"
                    className="w-full border-b border-gray-200 pb-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                    required
                />
            </div>

            {validationError && (
                <p role="alert" className="text-xs text-red-700">
                    {validationError}
                </p>
            )}

            <button
                type="submit"
                className="w-full py-3 text-xs font-bold uppercase tracking-[0.2em] bg-gray-900 text-white hover:bg-[#ADA996] transition-colors"
            >
                Rechercher
            </button>
        </form>
    );
};

export default GuestSearchForm;