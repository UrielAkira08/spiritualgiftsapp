
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

interface IdentifyForQuizScreenProps {
  onProceed: (name: string, email: string) => void;
  onBack: () => void;
}

const IdentifyForQuizScreen: React.FC<IdentifyForQuizScreenProps> = ({ onProceed, onBack }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const uiTexts = {
    title: { en: "Identification for Questionnaire", es: "Identificación para el Cuestionario" },
    description: { en: "Please enter your full name and email address to begin. This information will be used to save and associate your results.", es: "Por favor, ingrese su nombre completo y dirección de correo electrónico para comenzar. Esta información se utilizará para guardar y asociar sus resultados." },
    fullNameLabel: { en: "Full Name:", es: "Nombre Completo:" },
    fullNamePlaceholder: { en: "E.g., John Doe", es: "Ej., Juan Pérez" },
    emailLabel: { en: "Email Address:", es: "Dirección de Correo Electrónico:" },
    emailPlaceholder: { en: "E.g., john.doe@example.com", es: "Ej., juan.perez@ejemplo.com" },
    nameRequiredError: { en: "Full name is required.", es: "El nombre completo es obligatorio." },
    emailRequiredError: { en: "Email address is required.", es: "La dirección de correo electrónico es obligatoria." },
    invalidEmailError: { en: "Please enter a valid email address.", es: "Por favor, ingrese una dirección de correo electrónico válida." },
    backButton: { en: "Back", es: "Volver" },
    continueButton: { en: "Continue to Questionnaire", es: "Continuar al Cuestionario" },
  };

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    let isValid = true;
    if (name.trim() === '') { setNameError(t(uiTexts.nameRequiredError)); isValid = false; } else { setNameError(''); }
    if (email.trim() === '') { setEmailError(t(uiTexts.emailRequiredError)); isValid = false; } 
    else if (!validateEmail(email)) { setEmailError(t(uiTexts.invalidEmailError)); isValid = false; } 
    else { setEmailError(''); }
    if (isValid) onProceed(name.trim(), email.trim());
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 sm:p-10 space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-sky-700 mb-4 text-center">{t(uiTexts.title)}</h2>
      <p className="text-gray-600 text-sm text-center mb-6">{t(uiTexts.description)}</p>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">{t(uiTexts.fullNameLabel)}</label>
        <input type="text" id="fullName" value={name} onChange={(e) => setName(e.target.value)} placeholder={t(uiTexts.fullNamePlaceholder)} className={`w-full px-3 py-2 border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500`} aria-required="true" aria-describedby="nameError" />
        {nameError && <p id="nameError" className="text-xs text-red-600 mt-1">{nameError}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t(uiTexts.emailLabel)}</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t(uiTexts.emailPlaceholder)} className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500`} aria-required="true" aria-describedby="emailError" />
        {emailError && <p id="emailError" className="text-xs text-red-600 mt-1">{emailError}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button onClick={onBack} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150" aria-label={t(uiTexts.backButton)}><i className="fas fa-arrow-left mr-2"></i> {t(uiTexts.backButton)}</button>
        <button onClick={handleSubmit} className="w-full sm:flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150" aria-label={t(uiTexts.continueButton)}><i className="fas fa-play-circle mr-2"></i> {t(uiTexts.continueButton)}</button>
      </div>
    </div>
  );
};

export default IdentifyForQuizScreen;
