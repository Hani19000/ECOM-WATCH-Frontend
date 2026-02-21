import { Eye, EyeClosed } from 'lucide-react';

const PasswordInput = ({
    label,
    name,
    value,
    onChange,
    isVisible,
    onToggle,
    error = null,
    placeholder = "******" // Par défaut
}) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type={isVisible ? 'text' : 'password'}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-transparent focus:border-transparent transition-all"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {isVisible ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
            </div>
            {/* Affichage d'une erreur simple (ex: "Ne correspondent pas") */}
            {error && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PasswordInput;