
import React from 'react';
import { UserResult, GiftScore } from '../types';
import { useLanguage } from './LanguageContext';

interface ResultsDisplayProps {
  result: UserResult & { saveError?: string }; // saveError is already a string from App.tsx
  onReset: () => void;
  onNavigateToDevelopmentGuide: () => void; 
}

const GiftCard: React.FC<{ giftScore: GiftScore, rank: number }> = ({ giftScore, rank }) => {
  const { t, getLocalizedGiftName } = useLanguage();
  const { gift, score } = giftScore;
  const colors = ["bg-sky-600", "bg-teal-600", "bg-indigo-600", "bg-sky-500", "bg-teal-500", "bg-indigo-500"];
  const rankColor = colors[rank-1] || 'bg-gray-500';

  const scoreText = { en: "Score", es: "Puntuación" };
  const descriptionText = { en: "Description:", es: "Descripción:" };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className={`${rankColor} text-white p-5`}>
        <h3 className="text-2xl font-bold">{rank}. {getLocalizedGiftName(gift.name)}</h3>
        <p className="text-lg">{t(scoreText)}: {score}</p>
      </div>
      <div className="p-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">{t(descriptionText)}</h4>
        <p className="text-gray-700 text-sm leading-relaxed">{t(gift.description)}</p>
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset, onNavigateToDevelopmentGuide }) => {
  const { t, getLocalizedGiftName } = useLanguage();

  const uiTexts = {
    resultsTitle: { en: "Questionnaire Results", es: "Resultados del Cuestionario" },
    hello: { en: "Hello", es: "Hola" },
    mostProminentGifts: { en: "these are your most prominent spiritual gifts:", es: "estos son tus dones espirituales más prominentes:" },
    errorSavingTitle: { en: "Error Saving Questionnaire Results:", es: "Error al Guardar los Resultados del Cuestionario:" },
    resultsDisplayedLocally: { en: "Your questionnaire results are displayed locally.", es: "Los resultados de tu cuestionario se muestran localmente." },
    allScoresTitle: { en: "All Your Scores", es: "Todas Tus Puntuaciones" },
    backToHome: { en: "Back to Home", es: "Volver al Inicio" },
    takeAgain: { en: "Take Questionnaire Again", es: "Realizar Cuestionario de Nuevo" },
    createViewPlan: { en: "Create/View Development Plan", es: "Crear/Ver Plan de Desarrollo" },
    noteTopThree: { en: "Note your top three scores; this will help you discern your area of spiritual service for God and His church.", es: "Anote sus tres puntuaciones más altas; esto le ayudará a discernir su área de servicio espiritual para Dios y Su iglesia." },
    planHelpsReflect: { en: "The Ministry Development Plan will help you reflect on how you can use your gifts in service.", es: "El Plan de Desarrollo Ministerial le ayudará a reflexionar sobre cómo puede usar sus dones en servicio." }
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-700 mb-3">{t(uiTexts.resultsTitle)}</h2>
        <p className="text-xl text-gray-600">
          {t(uiTexts.hello)} <span className="font-semibold text-sky-600">{result.name}</span>, {t(uiTexts.mostProminentGifts)}
        </p>
      </div>

      {result.saveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-md text-center">
          <p className="text-red-700 font-semibold"><i className="fas fa-exclamation-triangle mr-2"></i>{t(uiTexts.errorSavingTitle)}</p>
          <p className="text-red-600 text-sm">{result.saveError}</p>
          <p className="text-red-600 text-sm mt-1">{t(uiTexts.resultsDisplayedLocally)}</p>
        </div>
      )}

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {result.topGifts.map((gs, index) => (
          <GiftCard key={gs.gift.id} giftScore={gs} rank={index + 1} />
        ))}
      </div>
      
      {result.allScores.length > 3 && (
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
            <h3 className="text-2xl font-semibold text-sky-700 mb-6 text-center">{t(uiTexts.allScoresTitle)}</h3>
            <ul className="space-y-3">
                {result.allScores.sort((a,b) => b.score - a.score).map(gs => (
                    <li key={gs.gift.id} className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                        <span className="text-gray-800 font-medium">{getLocalizedGiftName(gs.gift.name)}</span>
                        <span className="text-sky-600 font-bold px-3 py-1 bg-sky-100 rounded-full text-sm">{gs.score}</span>
                    </li>
                ))}
            </ul>
        </div>
      )}

      <div className="mt-12 text-center space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
        <button onClick={onReset} className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out text-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50">
          <i className="fas fa-home mr-2"></i> {t(uiTexts.backToHome)}
        </button>
        <button onClick={onReset} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
          <i className="fas fa-redo-alt mr-2"></i> {t(uiTexts.takeAgain)}
        </button>
        <button onClick={onNavigateToDevelopmentGuide} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" aria-label={t(uiTexts.createViewPlan)}>
          <i className="fas fa-seedling mr-2"></i> {t(uiTexts.createViewPlan)}
        </button>
      </div>
       <p className="text-center text-xs text-gray-500 mt-4">{t(uiTexts.noteTopThree)}</p>
       <p className="text-center text-sm text-gray-600 mt-6">{t(uiTexts.planHelpsReflect)}</p>
    </div>
  );
};

export default ResultsDisplay;
