
export type Language = 'en' | 'es';

export interface LocalizedString {
  en: string;
  es: string;
}

export interface Question {
  id: number;
  text: LocalizedString;
}

export interface GiftDefinition {
  id: string; 
  name: LocalizedString;
  questions: number[]; 
  description: LocalizedString;
}

export interface Answer {
  questionId: number;
  value: number; // 1-5
}

export interface UserAnswers {
  [questionId: number]: number;
}

export interface GiftScore {
  gift: GiftDefinition; // This will now carry LocalizedString for name and description
  score: number;
}

export interface UserResult {
  id?: string; 
  name: string;
  userEmail?: string; 
  topGifts: GiftScore[];
  allScores: GiftScore[];
  createdAt: Date | any; 
  saveError?: string; 
}

export enum AppStep {
  Welcome,
  IdentifyForQuiz, 
  IdentifyForDevelopment, 
  Form,
  Calculating,
  Saving,
  Results,
  DevelopmentGuide,
}

export interface DevelopmentPlanData {
  step1_primaryGifts: string; // This will be pre-filled with localized gift names
  step1_secondaryGifts: string;
  step2_categories: {
    numericos: boolean;
    madurez: boolean;
    organicos: boolean;
  };
  step3_functionsInChurch: string;
  step3_newMinistriesToStart: string;
  step4_chosenMinistries: string;
  step5_potentialBarriers: string;
  step5_ministryImpactOnChurch: string;
  step6_studyAndLearningPlan: string;
  step7_currentResources: string;
  step7_neededResources: string;
  step8_helperSkillsNeeded: string;
  step8_helperTrainingPlan: string;
  step9_supportGroupTemperament: string;
  step9_supportGroupResources: string;
  step10_baseOfOperations: string;
  step11_actionPlanDetails: string;
  step12_timeline_3months: string;
  step12_timeline_1year: string;
  step12_timeline_longTerm: string;
  lastUpdated?: any; 
}

export const initialDevelopmentPlanData: DevelopmentPlanData = {
  step1_primaryGifts: '',
  step1_secondaryGifts: '',
  step2_categories: {
    numericos: false,
    madurez: false,
    organicos: false,
  },
  step3_functionsInChurch: '',
  step3_newMinistriesToStart: '',
  step4_chosenMinistries: '',
  step5_potentialBarriers: '',
  step5_ministryImpactOnChurch: '',
  step6_studyAndLearningPlan: '',
  step7_currentResources: '',
  step7_neededResources: '',
  step8_helperSkillsNeeded: '',
  step8_helperTrainingPlan: '',
  step9_supportGroupTemperament: '',
  step9_supportGroupResources: '',
  step10_baseOfOperations: '',
  step11_actionPlanDetails: '',
  step12_timeline_3months: '',
  step12_timeline_1year: '',
  step12_timeline_longTerm: '',
};

// For constants.tsx
export interface RatingLabelData {
  value: number;
  label: string; // The numeric label itself (e.g., "1", "2")
  description: LocalizedString;
}
