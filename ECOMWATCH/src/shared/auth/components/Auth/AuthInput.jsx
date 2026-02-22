import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';

const AuthInput = ({ label, name, type = "text", placeholder, icon, register, error }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Détermine le type réel à afficher (toggle entre password et text)
    const isPassword = type === 'password';
    const inputType = isPassword ? (isVisible ? 'text' : 'password') : type;

    return (
        <div className="space-y-1.5 relative">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-1">
                {label}
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ADA996] transition-colors">
                        {React.cloneElement(icon, { size: 18 })}
                    </div>
                )}

                <input
                    {...register(name)}
                    type={inputType}
                    placeholder={placeholder}
                    className={`w-full bg-gray-50 border border-gray-500 rounded-2xl py-4 ${icon ? 'pl-12' : 'px-6'} pr-12 text-sm outline-none focus:bg-white focus:border-[#ADA996] focus:ring-4 focus:ring-[#ADA996]/5 transition-all placeholder:text-gray-300`}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                        {isVisible ? <Eye size={18} /> : <EyeClosed size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 uppercase tracking-tighter">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default AuthInput;