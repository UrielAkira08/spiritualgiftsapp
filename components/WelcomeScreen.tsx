
import React from 'react';
import { RATING_INSTRUCTIONS, RATING_SCALE_DESCRIPTION, RATING_LABELS } from '../constants';
import { useLanguage } from './LanguageContext';

interface WelcomeScreenProps {
  onNavigateToQuizIdentification: () => void;
  onNavigateToDevelopmentIdentification: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onNavigateToQuizIdentification, 
  onNavigateToDevelopmentIdentification 
}) => {
  const { t } = useLanguage();

  const uiTexts = {
    welcomeTitle: { en: "Welcome to Spiritual Gifts Discovery and Development", es: "Bienvenido al Descubrimiento y Desarrollo de Dones Espirituales" },
    instructionsTitle: { en: "General Questionnaire Instructions:", es: "Instrucciones Generales del Cuestionario:" },
    ratingScaleTitle: { en: "Rating Scale:", es: "Escala de Calificación:" },
    takeQuestionnaire: { en: "Take Questionnaire", es: "Realizar Cuestionario" },
    discoverMyGifts: { en: "(Discover my gifts)", es: "(Descubrir mis dones)" },
    useDevelopGifts: { en: "Use/Develop Gifts", es: "Usar/Desarrollar Dones" },
    accessMyPlan: { en: "(Access my plan)", es: "(Acceder a mi plan)" },
    firstTimeOrReturning: { en: "If it's your first time, start with the questionnaire. If you already have results, access your development plan.", es: "Si es su primera vez, comience con el cuestionario. Si ya tiene resultados, acceda a su plan de desarrollo." }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 sm:p-10 space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-sky-700 mb-6 text-center">
        {t(uiTexts.welcomeTitle)}
      </h2>

      <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-md">
        <h3 className="text-xl font-semibold text-sky-800 mb-2">{t(uiTexts.instructionsTitle)}</h3>
        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line mb-4">{t(RATING_INSTRUCTIONS)}</p>
        
        <h3 className="text-lg font-semibold text-sky-800 mb-2">{t(uiTexts.ratingScaleTitle)}</h3>
        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line mb-4">{t(RATING_SCALE_DESCRIPTION)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-xs sm:text-sm">
            {RATING_LABELS.map(rl => (
                <div key={rl.value} className="p-3 bg-gray-100 rounded-md shadow-sm" title={t(rl.description)}>
                    <span className="font-bold text-sky-700">{rl.label}:</span> <span className="text-gray-600">{t(rl.description)}</span>
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={onNavigateToQuizIdentification}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-150 ease-in-out text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 flex flex-col items-center justify-center"
          aria-label={t(uiTexts.takeQuestionnaire)}
        >
          <i className="fas fa-tasks fa-2x mb-2"></i>
          <span>{t(uiTexts.takeQuestionnaire)}</span>
          <span className="text-xs font-normal mt-1">{t(uiTexts.discoverMyGifts)}</span>
        </button>

        <button
          onClick={onNavigateToDevelopmentIdentification}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-150 ease-in-out text-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex flex-col items-center justify-center"
          aria-label={t(uiTexts.useDevelopGifts)}
        >
          <i className="fas fa-seedling fa-2x mb-2"></i>
          <span>{t(uiTexts.useDevelopGifts)}</span>
           <span className="text-xs font-normal mt-1">{t(uiTexts.accessMyPlan)}</span>
        </button>
      </div>
       <p className="text-center text-sm text-gray-600 mt-6">
        {t(uiTexts.firstTimeOrReturning)}
      </p>
    </div>
  );
};

export default WelcomeScreen;
