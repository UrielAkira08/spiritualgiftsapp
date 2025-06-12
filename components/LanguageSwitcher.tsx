
import React from 'react';
import { useLanguage } from './LanguageContext';
import { Language } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-4">
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={language === 'en'}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors
                    ${language === 'en' 
                      ? 'bg-sky-600 text-white cursor-default' 
                      : 'bg-gray-200 text-gray-700 hover:bg-sky-500 hover:text-white'}`}
        aria-pressed={language === 'en'}
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        disabled={language === 'es'}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors
                    ${language === 'es' 
                      ? 'bg-sky-600 text-white cursor-default' 
                      : 'bg-gray-200 text-gray-700 hover:bg-sky-500 hover:text-white'}`}
        aria-pressed={language === 'es'}
      >
        Español
      </button>
    </div>
  );
};

export default LanguageSwitcher;
