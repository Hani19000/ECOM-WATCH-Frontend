import React from 'react';
import { Truck } from 'lucide-react';

// Sous-composant interne pour l'input
const InputGroup = ({ label, name, type = "text", value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1.5">
            {label}
        </label>
        <input
            type={type}
            name={name}
            id={name}
            required
            value={value}
            onChange={onChange}
            className="block w-full rounded-none border border-gray-200 px-3 py-2.5 text-gray-900 focus:border-[#ADA996] focus:ring-1 focus:ring-[#ADA996] focus:outline-none sm:text-sm transition-colors bg-white"
        />
    </div>
);

const CheckoutForm = ({ formData, handleInputChange, shippingOptions, selectedShippingMethod, onShippingMethodChange, onSubmit, id }) => {
    return (
        <form id={id} onSubmit={onSubmit} className="space-y-8">

            {/* Infos Perso */}
            <div>
                <h2 className="text-lg font-serif font-medium text-gray-900 mb-6">
                    Informations de livraison
                </h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <InputGroup label="Prénom" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                    <InputGroup label="Nom" name="lastName" value={formData.lastName} onChange={handleInputChange} />

                    <div className="sm:col-span-2">
                        <InputGroup label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="sm:col-span-2">
                        <InputGroup label="Adresse" name="address" value={formData.address} onChange={handleInputChange} />
                    </div>

                    <InputGroup label="Ville" name="city" value={formData.city} onChange={handleInputChange} />
                    <InputGroup label="Code Postal" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />

                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1.5">Pays</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="block w-full rounded-none border border-gray-200 px-3 py-2.5 text-gray-900 focus:border-[#ADA996] focus:ring-1 focus:ring-[#ADA996] focus:outline-none sm:text-sm bg-white"
                        >
                            <option value="France">France</option>
                            <option value="Belgium">Belgique</option>
                            <option value="Germany">Allemagne</option>
                            <option value="Spain">Espagne</option>
                            <option value="Italy">Italie</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <InputGroup label="Téléphone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            {/* Méthodes de Livraison */}
            <div>
                <h2 className="text-lg font-serif font-medium text-gray-900 mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#ADA996]" />
                    Méthode de livraison
                </h2>
                <div className="space-y-3">
                    {shippingOptions.length > 0 ? (
                        shippingOptions.map(option => (
                            <div
                                key={option.method}
                                onClick={() => onShippingMethodChange(option.method)}
                                className={`relative border rounded-sm p-4 cursor-pointer transition-all duration-200 ${selectedShippingMethod === option.method
                                        ? 'border-[#ADA996] bg-[#ADA996]/5 shadow-sm'
                                        : 'border-gray-200 hover:border-[#ADA996]/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedShippingMethod === option.method ? 'border-[#ADA996]' : 'border-gray-300'}`}>
                                            {selectedShippingMethod === option.method && <div className="w-2 h-2 rounded-full bg-[#ADA996]" />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                {option.label}
                                                {option.isFree && <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded">OFFERT</span>}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">Livraison : {option.estimatedDays}</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-bold font-mono ${option.isFree ? 'text-green-600' : 'text-gray-900'}`}>
                                        {option.isFree ? '0.00 €' : `${option.cost.toFixed(2)} €`}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Chargement des options...</p>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CheckoutForm;