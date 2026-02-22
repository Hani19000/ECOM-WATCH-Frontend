import { useState } from 'react';
import { Lock, Eye, EyeClosed } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useResetPasswordForm } from '../../hooks/UserSetPasswordForm';
import AuthHeader from '../Auth/AuthHeader';
import AuthActions from '../Auth/AuthActions';

/**
 * Variante de AuthInput avec toggle visibilité mot de passe.
 * Composant local : utilisé uniquement dans ce formulaire,
 * pas de raison de polluer les composants partagés.
 */
const PasswordField = ({ label, name, placeholder, register, error }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-4"
            >
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300">
                    <Lock />
                </div>
                <input
                    type={isVisible ? 'text' : 'password'}
                    id={name}
                    {...register(name)}
                    placeholder={placeholder}
                    className={`w-full bg-gray-50 border ${error ? 'border-red-200' : 'border-black'}
                              focus:border-[#ADA996] focus:bg-white rounded-2xl py-4
                              pl-12 pr-12 outline-none transition-all text-sm`}
                />
                <button
                    type="button"
                    onClick={() => setIsVisible((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    aria-label={isVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                    {isVisible ? <Eye size={16} /> : <EyeClosed size={16} />}
                </button>
            </div>
            {error && (
                <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">
                    {error.message}
                </p>
            )}
        </div>
    );
};

// ─── Formulaire principal ──────────────────────────────────────────────────────

const ResetPasswordForm = () => {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        hasToken,
        onSubmit,
    } = useResetPasswordForm();

    // Token absent de l'URL : lien invalide ou expiré
    if (!hasToken) {
        return (
            <div className="w-full max-w-md bg-white rounded-4xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8 md:p-12 text-center">
                <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-gray-900">
                    Lien invalide<span className="text-[#ADA996]">.</span>
                </h2>
                <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest font-bold leading-relaxed">
                    Ce lien est invalide ou a expiré.<br />
                    Veuillez en demander un nouveau.
                </p>
                <Link
                    to="/forgot-password"
                    className="mt-8 inline-block text-[10px] uppercase font-black tracking-widest text-gray-900 hover:text-[#ADA996] transition-colors"
                >
                    Demander un nouveau lien →
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-4xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8 md:p-12">

            <AuthHeader
                title="Nouveau mot de passe"
                subtitle="Choisissez un mot de passe sécurisé"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <PasswordField
                    label="Nouveau mot de passe"
                    name="newPassword"
                    placeholder="8 caractères min, 1 majuscule, 1 chiffre"
                    register={register}
                    error={errors.newPassword}
                />

                <PasswordField
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    placeholder="******"
                    register={register}
                    error={errors.confirmPassword}
                />

                <AuthActions
                    isSubmitting={isSubmitting}
                    label="Réinitialiser"
                    loadingLabel="Mise à jour..."
                />

            </form>

            <p className="text-center mt-8 text-xs text-gray-400 font-medium">
                Mot de passe retrouvé ?
                <Link
                    to="/login"
                    className="text-gray-900 font-black uppercase ml-2 hover:text-[#ADA996] transition-colors"
                >
                    Se connecter
                </Link>
            </p>

        </div>
    );
};

export default ResetPasswordForm;