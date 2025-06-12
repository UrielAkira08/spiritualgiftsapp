
import React from 'react';
import { Question, UserAnswers } from '../types';
import QuestionItem from './QuestionItem';
import ProgressBar from './ProgressBar';
import { useLanguage } from './LanguageContext';

interface QuestionnaireFormProps {
  questions: Question[];
  answers: UserAnswers;
  onAnswerChange: (questionId: number, value: number) => void;
  onSubmit: () => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  isFormDisabled: boolean;
  canProceed: boolean;
  currentPageIndex: number;
  totalPages: number;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questions, answers, onAnswerChange, onSubmit, onNextPage, onPrevPage,
  isFormDisabled, canProceed, currentPageIndex, totalPages,
}) => {
  const { t } = useLanguage();
  const isLastPage = currentPageIndex === totalPages - 1;
  const isFirstPage = currentPageIndex === 0;

  const uiTexts = {
    questionnairePart: { en: "Questionnaire - Part", es: "Cuestionario - Parte" },
    of: { en: "of", es: "de" },
    viewMyGifts: { en: "View My Gifts", es: "Ver Mis Dones" },
    next: { en: "Next", es: "Siguiente" },
    previous: { en: "Previous", es: "Anterior" },
    warnAllQuestionsPageToView: { en: "Please answer all questions on this page to view your gifts.", es: "Por favor, responda todas las preguntas de esta página para ver sus dones." },
    warnAllQuestionsPageToContinue: { en: "Please answer all questions on this page to continue.", es: "Por favor, responda todas las preguntas de esta página para continuar." },
  };

  const getButtonText = () => t(isLastPage ? uiTexts.viewMyGifts : uiTexts.next);
  const getProceedButtonIcon = () => isLastPage ? "fas fa-check-circle" : "fas fa-arrow-right";
  
  const getWarningMessage = () => {
    if (canProceed || isFormDisabled) return null;
    if (questions.some(q => answers[q.id] === undefined)) {
      return t(isLastPage ? uiTexts.warnAllQuestionsPageToView : uiTexts.warnAllQuestionsPageToContinue);
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-sky-700 mb-4 text-center">
          {t(uiTexts.questionnairePart)} {currentPageIndex + 1} {t(uiTexts.of)} {totalPages}
        </h2>
        <ProgressBar currentPage={currentPageIndex} totalPages={totalPages} />
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionItem key={q.id} question={q} currentAnswer={answers[q.id]} onAnswerChange={onAnswerChange} isSubmitting={isFormDisabled} />
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button onClick={onPrevPage} disabled={isFirstPage || isFormDisabled} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed" aria-label={t(uiTexts.previous)}>
          <i className="fas fa-arrow-left mr-2"></i> {t(uiTexts.previous)}
        </button>
        <button onClick={isLastPage ? onSubmit : onNextPage} disabled={!canProceed || isFormDisabled} className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-150 ease-in-out text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed" aria-label={getButtonText()}>
          <i className={`${getProceedButtonIcon()} mr-2`}></i> {getButtonText()}
        </button>
      </div>
      {getWarningMessage() && !isFormDisabled && (
           <p className="text-sm text-red-600 mt-3 text-center" role="alert"> {getWarningMessage()} </p>
      )}
    </div>
  );
};

export default QuestionnaireForm;
