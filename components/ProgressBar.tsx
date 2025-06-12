
import React from 'react';
import { useLanguage } from './LanguageContext';
import { UI_TEXTS } from '../constants'; // Assuming UI_TEXTS is moved or accessible

interface ProgressBarProps {
  currentPage: number; // 0-indexed
  totalPages: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPage, totalPages }) => {
  const { t } = useLanguage();
  const progressPercentage = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;

  const pageText = { en: "Page", es: "Página" };
  const ofText = { en: "of", es: "de" };
  const completeText = { en: "Complete", es: "Completo" };
  const progressLabelText = { en: `Questionnaire progress: ${Math.round(progressPercentage)}%`, es: `Progreso del cuestionario: ${Math.round(progressPercentage)}%` };


  return (
    <div className="my-6">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-sky-700">
          {t(pageText)} {currentPage + 1} {t(ofText)} {totalPages}
        </span>
        <span className="text-sm font-medium text-sky-700">{Math.round(progressPercentage)}% {t(completeText)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-sky-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label={t(progressLabelText)}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
