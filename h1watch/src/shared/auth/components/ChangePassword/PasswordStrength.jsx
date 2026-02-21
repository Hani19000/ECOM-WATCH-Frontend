const PasswordStrength = ({ strength, isVisible }) => {
    // Si le champ est vide ou non visible (selon besoin), on peut masquer
    if (!isVisible) return null;

    return (
        <div className="mt-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Force du mot de passe</span>
                <span className={`font-medium ${strength.label === 'Excellent' ? 'text-green-600' :
                        strength.label === 'Bon' ? 'text-blue-600' :
                            strength.label === 'Moyen' ? 'text-yellow-600' :
                                'text-red-600'
                    }`}>
                    {strength.label}
                </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${strength.color}`}
                    style={{ width: `${strength.percentage}%` }}
                />
            </div>
        </div>
    );
};

export default PasswordStrength;