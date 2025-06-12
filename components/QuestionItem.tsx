
import React from 'react';
import { Question } from '../types';
import { RATING_LABELS } from '../constants';
import RadioInput from './RadioInput';
import { useLanguage } from './LanguageContext';

interface QuestionItemProps {
  question: Question;
  currentAnswer?: number;
  onAnswerChange: (questionId: number, value: number) => void;
  isSubmitting: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, currentAnswer, onAnswerChange, isSubmitting }) => {
  const { t } = useLanguage();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerChange(question.id, parseInt(event.target.value, 10));
  };

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <p className="text-md sm:text-lg text-gray-800 mb-3">{t(question.text)}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {RATING_LABELS.map(({ value, label }) => ( // label (numeric) doesn't need translation here
          <RadioInput
            key={value}
            name={`question-${question.id}`}
            value={value}
            label={label} 
            checked={currentAnswer === value}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionItem;
