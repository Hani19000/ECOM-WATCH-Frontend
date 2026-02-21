import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useForgotPasswordForm } from '../../hooks/Useforgotpasswordform';
import AuthHeader from '../Auth/AuthHeader';
import AuthInput from '../Auth/AuthInput';
import AuthActions from '../Auth/AuthActions';

const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        isSubmitted,
        onSubmit,
    } = useForgotPasswordForm();

    // ── Écran de confirmation post-soumission ──────────────────────────────
    if (isSubmitted) {
        return (
            <div className="w-full max-w-md bg-white rounded-4xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8 md:p-12 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-6 h-6 text-[#ADA996]" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-gray-900">
                    Email envoyé<span className="text-[#ADA996]">.</span>
                </h2>
                <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest font-bold leading-relaxed">
                    Si un compte est associé à cet email,<br />un lien de réinitialisation a été envoyé.
                </p>
                <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest font-bold leading-relaxed">
                    veuillez bien verifier vos spam
                </p>
                <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-medium">
                    Le lien expire dans 1 heure.
                </p>
                <Link
                    to="/login"
                    className="mt-8 inline-block text-[10px] uppercase font-black tracking-widest text-gray-900 hover:text-[#ADA996] transition-colors"
                >
                    ← Retour à la connexion
                </Link>
            </div>
        );
    }

    // ── Formulaire principal ───────────────────────────────────────────────
    return (
        <div className="w-full max-w-md bg-white rounded-4xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8 md:p-12">

            <AuthHeader
                title="Mot de passe oublié"
                subtitle="Nous vous enverrons un lien de réinitialisation"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <AuthInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    icon={<Mail />}
                    register={register}
                    error={errors.email}
                />

                <AuthActions
                    isSubmitting={isSubmitting}
                    label="Envoyer le lien"
                    loadingLabel="Envoi en cours..."
                />

            </form>

            <p className="text-center mt-8 text-xs text-gray-400 font-medium">
                Vous vous souvenez ?
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

export default ForgotPasswordForm;