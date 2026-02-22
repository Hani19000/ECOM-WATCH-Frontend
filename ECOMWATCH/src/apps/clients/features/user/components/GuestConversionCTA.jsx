import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @component GuestConversionCTA
 * @description Invitation à la création de compte.
 * * CHOIX DESIGN LUXE :
 * - Abandon des dégradés "Start-up" (bleu/violet) pour un fond neutre.
 * - Utilisation de bordures fines et de typographie Serif.
 * - Le bouton est noir (intemporel) avec un hover doré (#ADA996).
 */
const GuestConversionCTA = ({ guestOrdersCount = 0, onDismiss }) => {
    const navigate = useNavigate();
    const [isDismissed, setIsDismissed] = useState(false);

    const handleDismiss = () => {
        setIsDismissed(true);
        if (onDismiss) onDismiss();
    };

    if (isDismissed) return null;

    return (
        <div className="relative border border-[#ADA996]/30 bg-[#ADA996]/5 p-8 sm:p-10 mb-10">
            {/* Bouton fermer discret */}
            <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors text-xs uppercase tracking-widest"
            >
                Fermer
            </button>

            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="space-y-3 text-center md:text-left">
                    <h3 className="text-2xl font-serif text-gray-900">
                        Conservez votre historique
                    </h3>
                    <p className="text-gray-600 font-light max-w-lg leading-relaxed text-sm">
                        Vous avez actuellement <span className="font-semibold text-gray-900">{guestOrdersCount} commande{guestOrdersCount > 1 ? 's' : ''}</span> en tant qu'invité.
                        Créez un compte pour sécuriser votre historique, et suivre vos livraisons en temps réel.
                    </p>
                </div>

                {/* Conteneur de boutons harmonisé */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={() => navigate('/register')}
                        className="flex-1 sm:min-w-[220px] bg-gray-900 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] 
                                   flex items-center justify-center whitespace-nowrap
                                   hover:bg-[#ADA996] transition-all duration-300 shadow-sm"
                    >
                        Créer mon compte
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 sm:min-w-[220px] border border-gray-900 text-gray-900 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] 
                                   flex items-center justify-center whitespace-nowrap
                                   hover:bg-gray-50 transition-all duration-300"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        </div>
    );
};
export default GuestConversionCTA;