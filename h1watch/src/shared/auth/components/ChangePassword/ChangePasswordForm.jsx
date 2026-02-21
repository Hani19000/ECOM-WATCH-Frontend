import { useChangePassword } from '../../hooks/useChangePassword';

// Import des sous-composants atomiques
import SecurityHeader from './SecurityHeader';
import PasswordInput from './PasswordInput';
import PasswordStrength from './PasswordStrength';
import PasswordRequirements from './PasswordRequirements';
import FormActions from './FormActions';

const ChangePasswordForm = () => {
    // Récupération de toute la logique depuis le hook
    const {
        formData,
        showPasswords,
        validationErrors,
        isFormValid,
        changingPassword,
        passwordStrength,
        handleChange,
        handleSubmit,
        togglePassword
    } = useChangePassword();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">

            <SecurityHeader />

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Ancien Mot de Passe */}
                <PasswordInput
                    label="Mot de passe actuel"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    isVisible={showPasswords.old}
                    onToggle={() => togglePassword('old')}
                />

                {/* 2. Nouveau Mot de Passe + Force + Requis */}
                <div>
                    <PasswordInput
                        label="Nouveau mot de passe"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        isVisible={showPasswords.new}
                        onToggle={() => togglePassword('new')}
                    />

                    <PasswordStrength
                        strength={passwordStrength}
                        isVisible={!!formData.newPassword}
                    />

                    <PasswordRequirements
                        errors={validationErrors}
                    />
                </div>

                {/* 3. Confirmation + Erreurs de correspondance */}
                <PasswordInput
                    label="Confirmer le nouveau mot de passe"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isVisible={showPasswords.confirm}
                    onToggle={() => togglePassword('confirm')}
                    // On combine les erreurs spécifiques ici (match ou same)
                    error={validationErrors.match || validationErrors.same}
                />

                {/* 4. Bouton d'action */}
                <FormActions
                    isSubmitting={changingPassword}
                    isValid={isFormValid}
                />

            </form>
        </div>
    );
};

export default ChangePasswordForm;