
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Language, LocalizedString } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (localizedString: LocalizedString | string) => string;
  t_raw: (key: keyof AllTranslations['dynamic']) => LocalizedString;
  getLocalizedGiftName: (giftNameObj: LocalizedString) => string;
}

// Define a structure for all translations, including dynamic ones from constants
interface AllTranslations {
  // Static keys for simple UI elements
  appTitle: LocalizedString;
  discoverGiftsHeader: LocalizedString;
  footerText: LocalizedString;
  page: LocalizedString;
  of: LocalizedString;
  complete: LocalizedString;
  // ... more static strings
  
  // Dynamic strings that might come from constants or be generated
  dynamic: {
    [key: string]: LocalizedString;
  }
}


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Optionally, retrieve saved language preference
    const savedLang = localStorage.getItem('appLanguage') as Language;
    return savedLang || 'en'; // Default to English
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang); // Save preference
    document.documentElement.lang = lang; // Update HTML lang attribute
  };

  const t = useCallback((localizedString: LocalizedString | string): string => {
    if (typeof localizedString === 'string') {
      return localizedString; // Already a plain string
    }
    return localizedString[language] || localizedString.en; // Fallback to English
  }, [language]);

  const getLocalizedGiftName = useCallback((giftNameObj: LocalizedString): string => {
    return t(giftNameObj);
  }, [t]);

  // Placeholder for a more structured translation system if needed later.
  // For now, most translations will be embedded in the constants/components using the LocalizedString type.
  const t_raw = (key: keyof AllTranslations['dynamic']): LocalizedString => {
    // This would fetch from a central translation store
    // Example: return allTranslations.dynamic[key];
    return { en: `Missing EN for ${key}`, es: `Missing ES for ${key}` }; // Placeholder
  };


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, t_raw, getLocalizedGiftName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
