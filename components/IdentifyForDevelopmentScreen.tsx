
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

interface IdentifyForDevelopmentScreenProps {
  onLoadPlan: (email: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string | null; // Error messages are already translated in App.tsx before passed here
}

const IdentifyForDevelopmentScreen: React.FC<IdentifyForDevelopmentScreenProps> = ({ onLoadPlan, onBack, isLoading, error }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const uiTexts = {
    title: { en: "Access Development Plan", es: "Acceder al Plan de Desarrollo" },
    description: { en: "Enter the email address you used when completing the questionnaire to load your results and development plan.", es: "Ingrese la dirección de correo electrónico que utilizó al completar el cuestionario para cargar sus resultados y plan de desarrollo." },
    errorTitle: { en: "Error:", es: "Error:" },
    emailLabel: { en: "Email Address:", es: "Dirección de Correo Electrónico:" },
    emailPlaceholder: { en: "E.g., john.doe@example.com", es: "Ej., juan.perez@ejemplo.com" },
    emailRequiredError: { en: "Email address is required.", es: "La dirección de correo electrónico es obligatoria." },
    invalidEmailError: { en: "Please enter a valid email address.", es: "Por favor, ingrese una dirección de correo electrónico válida." },
    backButton: { en: "Back", es: "Volver" },
    loadButton: { en: "Load Plan and Results", es: "Cargar Plan y Resultados" },
    loadingButton: { en: "Loading...", es: "Cargando..." },
  };
  
  const validateEmail = (emailString: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailString);

  const handleSubmit = async () => {
    if (email.trim() === '') { setEmailError(t(uiTexts.emailRequiredError)); return; }
    if (!validateEmail(email)) { setEmailError(t(uiTexts.invalidEmailError)); return; }
    setEmailError('');
    await onLoadPlan(email.trim());
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 sm:p-10 space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-sky-700 mb-4 text-center">{t(uiTexts.title)}</h2>
      <p className="text-gray-600 text-sm text-center mb-6">{t(uiTexts.description)}</p>
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md shadow-sm text-sm" role="alert">
            <strong className="font-bold">{t(uiTexts.errorTitle)}</strong>{' '} {error}
        </div>
      )}
      <div>
        <label htmlFor="emailDev" className="block text-sm font-medium text-gray-700 mb-1">{t(uiTexts.emailLabel)}</label>
        <input type="email" id="emailDev" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t(uiTexts.emailPlaceholder)} className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500`} aria-required="true" aria-describedby="emailDevError" disabled={isLoading} />
        {emailError && <p id="emailDevError" className="text-xs text-red-600 mt-1">{emailError}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button onClick={onBack} disabled={isLoading} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 disabled:bg-gray-300" aria-label={t(uiTexts.backButton)}><i className="fas fa-arrow-left mr-2"></i> {t(uiTexts.backButton)}</button>
        <button onClick={handleSubmit} disabled={isLoading} className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 disabled:bg-green-300" aria-label={t(uiTexts.loadButton)}>
          {isLoading ? (<><i className="fas fa-spinner fa-spin mr-2"></i>{t(uiTexts.loadingButton)}</>) : (<><i className="fas fa-folder-open mr-2"></i>{t(uiTexts.loadButton)}</>)}
        </button>
      </div>
    </div>
  );
};

export default IdentifyForDevelopmentScreen;
