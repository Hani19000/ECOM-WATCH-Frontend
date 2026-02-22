const PasswordRequirements = ({ errors }) => {
    const errorKeys = Object.keys(errors).filter(key => key !== 'match' && key !== 'same');

    if (errorKeys.length === 0) return null;

    return (
        <div className="mt-2 space-y-1 animate-fadeIn">
            {Object.entries(errors).map(([key, error]) => (
                key !== 'match' && key !== 'same' && (
                    <p key={key} className="text-xs text-red-600 flex items-center gap-1">
                        <span className="text-[10px]">•</span> {error}
                    </p>
                )
            ))}
        </div>
    );
};

export default PasswordRequirements;