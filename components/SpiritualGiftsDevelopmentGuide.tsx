
import React from 'react';
import { DevelopmentPlanData, GiftScore, LocalizedString } from '../types';
import { useLanguage } from './LanguageContext';

interface SpiritualGiftsDevelopmentGuideProps {
  userName: string;
  topGifts: GiftScore[];
  planData: DevelopmentPlanData;
  onPlanChange: (fieldName: keyof DevelopmentPlanData, value: any) => void;
  onSavePlan: () => void;
  onReset: () => void;
  onNavigateToResults: () => void;
  isLoading: boolean;
  isSaving: boolean;
  loadError: string | null; // Already a string from App.tsx
  saveError: string | null; // Already a string from App.tsx
}

interface FormTextareaProps {
  id: keyof DevelopmentPlanData;
  label: LocalizedString;
  value: string;
  onChange: (id: keyof DevelopmentPlanData, value: string) => void;
  placeholder?: LocalizedString;
  rows?: number;
  disabled?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ id, label, value, onChange, placeholder, rows = 4, disabled }) => {
  const { t } = useLanguage();
  const defaultPlaceholder = { en: `Write your thoughts for ${t(label).toLowerCase()} here...`, es: `Escriba sus pensamientos para ${t(label).toLowerCase()} aquí...`};
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{t(label)}</label>
      <textarea id={id} name={id} rows={rows} className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2 disabled:bg-gray-100" placeholder={placeholder ? t(placeholder) : t(defaultPlaceholder)} value={value} onChange={(e) => onChange(id, e.target.value)} disabled={disabled} aria-label={t(label)} />
    </div>
  );
};

interface StepSectionProps {
  stepNumber: number;
  title: LocalizedString;
  children: React.ReactNode;
}
const StepSection: React.FC<StepSectionProps> = ({ stepNumber, title, children }) => {
  const { t } = useLanguage();
  const stepText = { en: "STEP", es: "PASO" };
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold text-sky-700"> {t(stepText)} {stepNumber}: {t(title)} </h3>
      {children}
    </div>
  );
};

const SpiritualGiftsDevelopmentGuide: React.FC<SpiritualGiftsDevelopmentGuideProps> = ({
  userName, topGifts, planData, onPlanChange, onSavePlan, onReset, onNavigateToResults,
  isLoading, isSaving, loadError, saveError,
}) => {
  const { t, getLocalizedGiftName } = useLanguage();

  const uiTexts = {
    loadingPlan: { en: "Loading Development Plan...", es: "Cargando Plan de Desarrollo..." },
    loadingErrorTitle: { en: "Loading Error:", es: "Error al Cargar:" },
    backToHome: { en: "Back to Home", es: "Volver al Inicio" },
    backToResults: { en: "Back to Results", es: "Volver a Resultados" },
    planTitle: { en: "Ministry Development Plan", es: "Plan de Desarrollo Ministerial" },
    forUser: { en: "For:", es: "Para:" },
    primaryGiftsIdentified: { en: "Your primary identified gifts:", es: "Tus dones principales identificados:" },
    viewDetailedResults: { en: "View Detailed Results", es: "Ver Resultados Detallados" },
    errorSavingPlan: { en: "Error saving plan:", es: "Error al guardar el plan:" },
    savePlan: { en: "Save Plan", es: "Guardar Plan" },
    saving: { en: "Saving...", es: "Guardando..." },
    // Step Titles
    step1Title: { en: "Identify Your Spiritual Gifts", es: "Identifique Sus Dones Espirituales" },
    step2Title: { en: "Categorize Your Gifts", es: "Categorice Sus Dones" },
    step3Title: { en: "Define Your Roles", es: "Defina Sus Roles" },
    step4Title: { en: "List the Ministries You Have Chosen", es: "Enumere los Ministerios que Ha Elegido" },
    step5Title: { en: "Identify Barriers", es: "Identifique Barreras" },
    step6Title: { en: "Theory and Study", es: "Teoría y Estudio" },
    step7Title: { en: "Resources", es: "Recursos" },
    step8Title: { en: "Your Helpers", es: "Sus Ayudantes" },
    step9Title: { en: "Support Groups", es: "Grupos de Apoyo" },
    step10Title: { en: "Base of Operations", es: "Base de Operaciones" },
    step11Title: { en: "Action Plan", es: "Plan de Acción" },
    step12Title: { en: "Develop a Timeline for Your Ministry", es: "Desarrolle un Cronograma para Su Ministerio" },
    // Form Labels
    primaryGiftsLabel: { en: "My primary gifts are (auto-filled):", es: "Mis dones primarios son (autocompletado):" },
    secondaryGiftsLabel: { en: "My secondary gifts are:", es: "Mis dones secundarios son:" },
    checkCategoriesHelpText: { en: "Check the categories you believe fit your gifts (based on pages 26-27 of the reference PDF):", es: "Marque las categorías que crea que se ajustan a sus dones (basado en las páginas 26-27 del PDF de referencia):" },
    functionsInChurchLabel: { en: "In what functions, roles, or positions do your gifts fit within the traditional Church structure?", es: "¿En qué funciones, roles o posiciones encajan sus dones dentro de la estructura tradicional de la Iglesia?" },
    newMinistriesToStartLabel: { en: "What ministries that do not currently exist in the traditional church structure might you need to start?", es: "¿Qué ministerios que actualmente no existen en la estructura tradicional de la iglesia podría necesitar iniciar?" },
    chosenMinistriesLabel: { en: "Chosen Ministries (refer to 'Spiritual Gifts Distribution' pages 21-24 of the PDF):", es: "Ministerios Elegidos (consulte las páginas 21-24 de 'Distribución de Dones Espirituales' del PDF):" },
    potentialBarriersLabel: { en: "List the barriers you believe may arise when establishing your ministries:", es: "Enumere las barreras que cree que pueden surgir al establecer sus ministerios:" },
    ministryImpactLabel: { en: "How do these ministries affect the rest of your church's program? (positive and negative factors):", es: "¿Cómo afectan estos ministerios al resto del programa de su iglesia? (factores positivos y negativos):" },
    studyPlanLabel: { en: "What do you need to study and learn to successfully practice your ministry? (books, seminars, etc.):", es: "¿Qué necesita estudiar y aprender para practicar con éxito su ministerio? (libros, seminarios, etc.):" },
    currentResourcesLabel: { en: "Resources you already have (materials, places, finances, etc.):", es: "Recursos que ya tiene (materiales, lugares, finanzas, etc.):" },
    neededResourcesLabel: { en: "Resources you need to find or obtain:", es: "Recursos que necesita encontrar u obtener:" },
    helperSkillsLabel: { en: "What skills will you need from people to carry out this ministry?", es: "¿Qué habilidades necesitará de las personas para llevar a cabo este ministerio?" },
    helperTrainingLabel: { en: "What type of training do the people who will work with you need? (how and where to get it):", es: "¿Qué tipo de capacitación necesitan las personas que trabajarán con usted? (cómo y dónde obtenerla):" },
    supportGroupTemperamentLabel: { en: "Supportive temperament (people who counterbalance your temperament):", es: "Temperamento de apoyo (personas que contrarrestan su temperamento):" },
    supportGroupResourcesLabel: { en: "Support resources (people for study/research, financial support, etc.):", es: "Recursos de apoyo (personas para estudio/investigación, apoyo financiero, etc.):" },
    baseOfOperationsLabel: { en: "Where will your base of operations be? (home, church, etc.):", es: "¿Dónde estará su base de operaciones? (hogar, iglesia, etc.):" },
    actionPlanDetailsLabel: { en: "When will your ministry begin? Who do you need to talk to? What authorizations do you need?", es: "¿Cuándo comenzará su ministerio? ¿Con quién necesita hablar? ¿Qué autorizaciones necesita?" },
    timeline3MonthsLabel: { en: "Expected Achievements in Three Months:", es: "Logros Esperados en Tres Meses:" },
    timeline1YearLabel: { en: "Expected Achievements in One Year:", es: "Logros Esperados en Un Año:" },
    timelineLongTermLabel: { en: "Expected Achievements Long-Term:", es: "Logros Esperados a Largo Plazo:" },
  };

  const handleCategoryChange = (category: keyof DevelopmentPlanData['step2_categories']) => {
    onPlanChange('step2_categories', { [category]: !planData.step2_categories[category] });
  };

  if (isLoading) return <div className="flex flex-col items-center justify-center h-64 bg-white shadow-xl rounded-lg p-8"><i className="fas fa-spinner fa-spin text-5xl text-sky-600 mb-6"></i><p className="text-2xl font-semibold text-sky-700">{t(uiTexts.loadingPlan)}</p></div>;
  if (loadError) return <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md shadow-lg text-center"><strong className="font-bold">{t(uiTexts.loadingErrorTitle)}</strong><span className="block sm:inline mb-3"> {loadError}</span><div className="mt-4 space-x-2 flex flex-col sm:flex-row sm:justify-center gap-2"><button onClick={onReset} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"><i className="fas fa-home mr-2"></i> {t(uiTexts.backToHome)}</button><button onClick={onNavigateToResults} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"><i className="fas fa-arrow-left mr-2"></i> {t(uiTexts.backToResults)}</button></div></div>;
  
  const topGiftsText = topGifts.map(g => getLocalizedGiftName(g.gift.name)).join(', ');
  const categoryDisplayLabels: Record<keyof DevelopmentPlanData['step2_categories'], LocalizedString> = {
    numericos: { en: 'Numerical', es: 'Numéricos' },
    madurez: { en: 'Edification/Maturity', es: 'Edificación/Madurez' },
    organicos: { en: 'Relational/Organic', es: 'Relacionales/Orgánicos' },
  };

  return (
    <div className="space-y-8 py-8">
      <div className="text-center mb-4"><h2 className="text-2xl sm:text-3xl font-extrabold text-sky-800 mb-2">{t(uiTexts.planTitle)}</h2><p className="text-lg text-gray-700">{t(uiTexts.forUser)} <span className="font-semibold text-sky-600">{userName}</span></p><p className="text-md text-gray-600">{t(uiTexts.primaryGiftsIdentified)} <span className="font-medium text-teal-600">{topGiftsText}</span></p></div>
      <div className="text-center mb-8"><button onClick={onNavigateToResults} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" aria-label={t(uiTexts.viewDetailedResults)}><i className="fas fa-poll-h mr-2"></i>{t(uiTexts.viewDetailedResults)}</button></div>
      {saveError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center"><i className="fas fa-exclamation-circle mr-2"></i>{t(uiTexts.errorSavingPlan)} {saveError}</div>}
      <div className="space-y-6">
        <StepSection stepNumber={1} title={uiTexts.step1Title}><FormTextarea id="step1_primaryGifts" label={uiTexts.primaryGiftsLabel} value={planData.step1_primaryGifts || topGiftsText} onChange={onPlanChange} disabled={true} /><FormTextarea id="step1_secondaryGifts" label={uiTexts.secondaryGiftsLabel} value={planData.step1_secondaryGifts} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={2} title={uiTexts.step2Title}><p className="text-sm text-gray-600 mb-2">{t(uiTexts.checkCategoriesHelpText)}</p><div className="space-y-2">{(Object.keys(categoryDisplayLabels) as Array<keyof DevelopmentPlanData['step2_categories']>).map(cat => (<label key={cat} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={planData.step2_categories[cat]} onChange={() => handleCategoryChange(cat)} className="form-checkbox h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500" /><span className="text-gray-700 capitalize">{t(categoryDisplayLabels[cat])}</span></label>))}</div></StepSection>
        <StepSection stepNumber={3} title={uiTexts.step3Title}><FormTextarea id="step3_functionsInChurch" label={uiTexts.functionsInChurchLabel} value={planData.step3_functionsInChurch} onChange={onPlanChange} /><FormTextarea id="step3_newMinistriesToStart" label={uiTexts.newMinistriesToStartLabel} value={planData.step3_newMinistriesToStart} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={4} title={uiTexts.step4Title}><FormTextarea id="step4_chosenMinistries" label={uiTexts.chosenMinistriesLabel} value={planData.step4_chosenMinistries} onChange={onPlanChange} rows={6} /></StepSection>
        <StepSection stepNumber={5} title={uiTexts.step5Title}><FormTextarea id="step5_potentialBarriers" label={uiTexts.potentialBarriersLabel} value={planData.step5_potentialBarriers} onChange={onPlanChange} /><FormTextarea id="step5_ministryImpactOnChurch" label={uiTexts.ministryImpactLabel} value={planData.step5_ministryImpactOnChurch} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={6} title={uiTexts.step6Title}><FormTextarea id="step6_studyAndLearningPlan" label={uiTexts.studyPlanLabel} value={planData.step6_studyAndLearningPlan} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={7} title={uiTexts.step7Title}><FormTextarea id="step7_currentResources" label={uiTexts.currentResourcesLabel} value={planData.step7_currentResources} onChange={onPlanChange} /><FormTextarea id="step7_neededResources" label={uiTexts.neededResourcesLabel} value={planData.step7_neededResources} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={8} title={uiTexts.step8Title}><FormTextarea id="step8_helperSkillsNeeded" label={uiTexts.helperSkillsLabel} value={planData.step8_helperSkillsNeeded} onChange={onPlanChange} /><FormTextarea id="step8_helperTrainingPlan" label={uiTexts.helperTrainingLabel} value={planData.step8_helperTrainingPlan} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={9} title={uiTexts.step9Title}><FormTextarea id="step9_supportGroupTemperament" label={uiTexts.supportGroupTemperamentLabel} value={planData.step9_supportGroupTemperament} onChange={onPlanChange} /><FormTextarea id="step9_supportGroupResources" label={uiTexts.supportGroupResourcesLabel} value={planData.step9_supportGroupResources} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={10} title={uiTexts.step10Title}><FormTextarea id="step10_baseOfOperations" label={uiTexts.baseOfOperationsLabel} value={planData.step10_baseOfOperations} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={11} title={uiTexts.step11Title}><FormTextarea id="step11_actionPlanDetails" label={uiTexts.actionPlanDetailsLabel} value={planData.step11_actionPlanDetails} onChange={onPlanChange} /></StepSection>
        <StepSection stepNumber={12} title={uiTexts.step12Title}><FormTextarea id="step12_timeline_3months" label={uiTexts.timeline3MonthsLabel} value={planData.step12_timeline_3months} onChange={onPlanChange} /><FormTextarea id="step12_timeline_1year" label={uiTexts.timeline1YearLabel} value={planData.step12_timeline_1year} onChange={onPlanChange} /><FormTextarea id="step12_timeline_longTerm" label={uiTexts.timelineLongTermLabel} value={planData.step12_timeline_longTerm} onChange={onPlanChange} /></StepSection>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button onClick={onSavePlan} disabled={isSaving} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300" aria-label={t(uiTexts.savePlan)}>{isSaving ? (<><i className="fas fa-spinner fa-spin mr-2"></i>{t(uiTexts.saving)}</>) : (<><i className="fas fa-save mr-2"></i>{t(uiTexts.savePlan)}</>)}</button>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"><button onClick={onNavigateToResults} className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400" aria-label={t(uiTexts.backToResults)}><i className="fas fa-arrow-left mr-2"></i> {t(uiTexts.backToResults)}</button><button onClick={onReset} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400" aria-label={t(uiTexts.backToHome)}><i className="fas fa-home mr-2"></i> {t(uiTexts.backToHome)}</button></div>
      </div>
    </div>
  );
};

export default SpiritualGiftsDevelopmentGuide;
