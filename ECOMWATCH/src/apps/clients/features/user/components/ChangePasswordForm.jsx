import { Eye, EyeClosed } from 'lucide-react';
import { useChangePasswordForm } from '../hooks/useChangePasswordForm';

const ChangePasswordForm = () => {
    const {
        formData, showPasswords, validationErrors, passwordStrength, isFormValid,
        changingPassword, handleChange, handleSubmit, togglePassword
    } = useChangePasswordForm();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="mb-8">
                <h3 className="text-xl font-light tracking-tight text-gray-900 uppercase">Sécurité du compte</h3>
                <div className="mt-4 relative pl-4 border-l-2 border-[#ADA996]">
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Politique de confidentialité</p>
                    <p className="text-sm text-gray-600 mt-1 font-light italic leading-relaxed">
                        "Afin de garantir l'intégrité de votre accès, le système n'autorise pas la réutilisation de vos 2 mots de passe précédents."
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Champ Ancien Mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                    <div className="relative">
                        <input
                            type={showPasswords.old ? 'text' : 'password'}
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-transparent"
                        />
                        <button type="button" onClick={() => togglePassword('old')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPasswords.old ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>
                </div>

                {/* Champ Nouveau Mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                    <div className="relative">
                        <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-transparent"
                        />
                        <button type="button" onClick={() => togglePassword('new')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPasswords.new ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>

                    {formData.newPassword && (
                        <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Force</span>
                                <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${passwordStrength.percentage}%` }} />
                            </div>
                        </div>
                    )}

                    {Object.keys(validationErrors).map((key) => key !== 'match' && (
                        <p key={key} className="text-xs text-red-600 mt-1 flex items-center gap-1"><span>•</span> {validationErrors[key]}</p>
                    ))}
                </div>

                {/* Champ Confirmation */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                    <div className="relative">
                        <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-transparent"
                        />
                        <button type="button" onClick={() => togglePassword('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPasswords.confirm ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>
                    {validationErrors.match && <p className="mt-1 text-xs text-red-600">{validationErrors.match}</p>}
                    {validationErrors.same && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><span>•</span> {validationErrors.same}</p>}
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={!isFormValid || changingPassword}
                        className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-[#ADA996] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {changingPassword ? 'Modification en cours...' : 'Changer le mot de passe'}
                    </button>
                    <p className="mt-4 text-center text-[12px] uppercase tracking-tighter text-black">
                        Protection active : limite de 3 tentatives par quart d'heure
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;