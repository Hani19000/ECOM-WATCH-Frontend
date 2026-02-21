import { useProfile } from "../hooks/useProfile";
import { useProfileForm } from '../hooks/useProfileForm';

const ProfileSkeleton = () => (
    <div className="animate-pulse space-y-8 max-w-2xl">
        <div className="h-8 bg-gray-100 w-1/3 mb-12" />
        <div className="space-y-12">
            <div className="grid grid-cols-2 gap-8"><div className="h-10 bg-gray-50" /><div className="h-10 bg-gray-50" /></div>
            <div className="h-10 bg-gray-50" />
        </div>
    </div>
);

const ProfileFormContent = ({ profile, updating, updateProfile }) => {
    // Utilisation du hook existant !
    const { formData, hasChanges, handleChange, handleSubmit, handleReset } = useProfileForm(profile, updateProfile);

    const inputClasses = "w-full py-2 bg-transparent border-b border-gray-200 focus:border-[#ADA996] outline-none text-gray-900 placeholder-gray-300 font-light text-base rounded-none";
    const labelClasses = "block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium";

    return (
        <div className="animate-fadeIn max-w-3xl">
            <header className="mb-12 border-b border-gray-50 pb-8">
                <h2 className="text-3xl font-serif text-gray-900 italic">Informations Personnelles</h2>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <label className={labelClasses}>Prénom</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange} disabled={updating} className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Nom</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange} disabled={updating} className={inputClasses} />
                    </div>
                </div>

                <div className="opacity-60">
                    <label className={labelClasses}>Email (Identifiant)</label>
                    <div className="py-2 border-b border-gray-100 text-gray-500 font-mono text-sm">{profile.email}</div>
                </div>

                <div className="pt-8 flex items-center gap-6">
                    <button type="submit" disabled={updating || !hasChanges} className={`px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] min-w-[160px] ${updating || !hasChanges ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white hover:bg-[#ADA996]'}`}>
                        {updating ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    {hasChanges && !updating && (
                        <button type="button" onClick={handleReset} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-800">
                            Annuler les modifications
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

const ProfileForm = () => {
    const { profile, updating, updateProfile } = useProfile();
    if (!profile) return <ProfileSkeleton />;
    return <ProfileFormContent key={profile.id} profile={profile} updating={updating} updateProfile={updateProfile} />;
};

export default ProfileForm;