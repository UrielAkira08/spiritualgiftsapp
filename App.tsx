
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AppStep, UserAnswers, UserResult, GiftScore, Question, DevelopmentPlanData, initialDevelopmentPlanData, LocalizedString } from './types';
import { ALL_QUESTIONS, GIFTS_DEFINITIONS, QUESTIONS_PER_PAGE } from './constants';
import WelcomeScreen from './components/WelcomeScreen'; 
import IdentifyForQuizScreen from './components/IdentifyForQuizScreen';
import IdentifyForDevelopmentScreen from './components/IdentifyForDevelopmentScreen';
import QuestionnaireForm from './components/QuestionnaireForm'; 
import ResultsDisplay from './components/ResultsDisplay'; 
import SpiritualGiftsDevelopmentGuide from './components/SpiritualGiftsDevelopmentGuide'; 
import LanguageSwitcher from './components/LanguageSwitcher';
import { useLanguage } from './components/LanguageContext';
import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore"; 

const sanitizeFirestoreId = (id: string): string => {
  if (!id) return `default_id_${Date.now()}`; 
  let sanitizedId = id.replace(/[\/\#\$\[\]]/g, '_'); 
  if (sanitizedId.trim() === '') sanitizedId = `empty_id_${Date.now()}`;
  if (sanitizedId === '.' || sanitizedId === '..') sanitizedId = `id_${sanitizedId.replace(/\./g, '_')}`;
  if (sanitizedId.length > 500) sanitizedId = sanitizedId.substring(0, 500);
  return sanitizedId;
};

const App: React.FC = () => {
  const { language, t, getLocalizedGiftName } = useLanguage();

  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.Welcome);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [results, setResults] = useState<UserResult | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [saveError, setSaveError] = useState<LocalizedString | string | undefined>(undefined);

  const [developmentPlan, setDevelopmentPlan] = useState<DevelopmentPlanData | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState<boolean>(false);
  const [planLoadingError, setPlanLoadingError] = useState<LocalizedString | string | null>(null);
  const [isPlanSaving, setIsPlanSaving] = useState<boolean>(false);
  const [planSavingError, setPlanSavingError] = useState<LocalizedString | string | null>(null);
  const [generalLoadingError, setGeneralLoadingError] = useState<LocalizedString | string | null>(null);

  const appTexts = {
    discoverGiftsHeader: { en: "Discover Your Spiritual Gifts", es: "Descubre Tus Dones Espirituales" },
    footerText: { en: "Spiritual Gifts Application", es: "Aplicación de Dones Espirituales" },
    pleaseAnswerAllOnPage: { en: "Please answer all questions on this page to continue.", es: "Por favor, responda todas las preguntas de esta página para continuar." },
    pleaseAnswerAllToView: { en: "Please answer all questions on this page to view your gifts.", es: "Por favor, responda todas las preguntas de esta página para ver sus dones." },
    someAnswersMissing: { en: "It seems some answers are missing on previous pages. Please review.", es: "Parece que faltan algunas respuestas en páginas anteriores. Por favor, revise." },
    savingErrorDB: { en: "There was a problem saving your questionnaire results to the database. You can still view them locally.", es: "Hubo un problema al guardar los resultados de su cuestionario en la base de datos. Todavía puede verlos localmente." },
    calculatingResults: { en: "Calculating your results...", es: "Calculando tus resultados..." },
    savingResults: { en: "Saving your results...", es: "Guardando tus resultados..." },
    userEmailNotAvailableLoad: { en: "User email not available. Cannot load plan.", es: "Correo electrónico del usuario no disponible. No se puede cargar el plan." },
    resultsNotAvailableLoadCreate: { en: "Questionnaire results not available. Cannot load/create plan.", es: "Resultados del cuestionario no disponibles. No se puede cargar/crear el plan." },
    errorLoadingData: { en: "Error loading data. Please try again.", es: "Error al cargar datos. Por favor, inténtelo de nuevo." },
    noResultsForEmail: { en: "No questionnaire results found for this email. Please complete the questionnaire first.", es: "No se encontraron resultados del cuestionario para este correo electrónico. Por favor, complete el cuestionario primero." },
    errorLoadingDevPlan: { en: "Error loading development plan. Please try again.", es: "Error al cargar el plan de desarrollo. Por favor, inténtelo de nuevo." },
    enterEmailToLoadPlan: { en: "Please enter your email to load your plan.", es: "Por favor, ingrese su correo electrónico para cargar su plan." },
    noPlanOrEmailMissing: { en: "No plan data to save or user email is missing.", es: "No hay datos del plan para guardar o falta el correo electrónico del usuario." },
    errorSavingDevPlan: { en: "Error saving development plan. Please try again.", es: "Error al guardar el plan de desarrollo. Por favor, inténtelo de nuevo." },
    noResultsToDisplay: { en: "No results to display. Please complete the questionnaire.", es: "No hay resultados para mostrar. Por favor, complete el cuestionario." },
    couldNotLoadDevPlan: { en: "Could not load the development plan. Please try accessing again or complete the questionnaire.", es: "No se pudo cargar el plan de desarrollo. Por favor, intente acceder de nuevo o complete el cuestionario." },
    information: { en: "Information:", es: "Información:" },
    goToHome: { en: "Go to Home", es: "Ir al Inicio" },
    backToResults: { en: "Back to Results", es: "Volver a Resultados" },
  };
  
  useEffect(() => {
    document.title = t(appTexts.discoverGiftsHeader);
    document.documentElement.lang = language;
  }, [language, t, appTexts.discoverGiftsHeader]);

  const totalPages = useMemo(() => Math.ceil(ALL_QUESTIONS.length / QUESTIONS_PER_PAGE), []);

  const currentQuestions = useMemo((): Question[] => {
    const start = currentPageIndex * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return ALL_QUESTIONS.slice(start, end);
  }, [currentPageIndex]);

  const handleAnswerChange = useCallback((questionId: number, value: number) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: value }));
  }, []);

  const allQuestionsAnsweredGlobally = useMemo(() => ALL_QUESTIONS.length === Object.keys(answers).length, [answers]);
  const areCurrentPageQuestionsAnswered = useMemo(() => {
    if (currentStep !== AppStep.Form) return false;
    return currentQuestions.every(q => answers[q.id] !== undefined);
  }, [currentQuestions, answers, currentStep]);
  const canProceedOnCurrentPage = useMemo(() => areCurrentPageQuestionsAnswered, [areCurrentPageQuestionsAnswered]);

  const handleNavigateToQuizIdentification = useCallback(() => setCurrentStep(AppStep.IdentifyForQuiz), []);
  const handleNavigateToDevelopmentIdentification = useCallback(() => {
    setCurrentStep(AppStep.IdentifyForDevelopment);
    setPlanLoadingError(null); 
  }, []);
  const handleBackToWelcome = useCallback(() => setCurrentStep(AppStep.Welcome), []);

  const handleProceedToQuiz = useCallback((name: string, email: string) => {
    setUserName(name); setUserEmail(email); setSaveError(undefined); setAnswers({}); 
    setResults(null); setCurrentPageIndex(0); setCurrentStep(AppStep.Form);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const calculateScores = useCallback((): GiftScore[] => {
    return GIFTS_DEFINITIONS.map(giftDef => {
      const score = giftDef.questions.reduce((sum, qId) => sum + (answers[qId] || 0), 0);
      return { gift: giftDef, score };
    });
  }, [answers]);

  const handleNextPage = useCallback(() => {
    if (canProceedOnCurrentPage) {
      if (currentPageIndex < totalPages - 1) {
        setCurrentPageIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
       alert(t(appTexts.pleaseAnswerAllOnPage));
    }
  }, [canProceedOnCurrentPage, currentPageIndex, totalPages, t, appTexts.pleaseAnswerAllOnPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPageIndex]);

  const saveResultsToFirestore = async (resultToSave: Omit<UserResult, 'id' | 'createdAt'> & { createdAt: any }) => {
    try {
      const docRef = await addDoc(collection(db, "spiritualGiftResults"), { ...resultToSave, createdAt: serverTimestamp() });
      console.log("Result document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding result document: ", e);
      setSaveError(appTexts.savingErrorDB);
      throw e; 
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!allQuestionsAnsweredGlobally) { alert(t(appTexts.someAnswersMissing)); return; }
    if (!canProceedOnCurrentPage) { alert(t(appTexts.pleaseAnswerAllToView)); return; }
    setCurrentStep(AppStep.Calculating);
    const allScores = calculateScores();
    const sortedScores = [...allScores].sort((a, b) => b.score - a.score);
    const topGifts = sortedScores.slice(0, 3);
    const preliminaryResult: UserResult = { name: userName, userEmail: userEmail, topGifts: topGifts, allScores: allScores, createdAt: new Date() };
    setResults(preliminaryResult); 
    setCurrentStep(AppStep.Saving); 
    setSaveError(undefined);
    try {
      const { id, saveError: localSaveError, ...dataToSave } = preliminaryResult; 
      await saveResultsToFirestore(dataToSave as Omit<UserResult, 'id' | 'createdAt' | 'saveError'> & { createdAt: any });
    } catch (error) { /* Handled in saveResultsToFirestore */ } 
    finally { setCurrentStep(AppStep.Results); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }, [allQuestionsAnsweredGlobally, calculateScores, userName, userEmail, canProceedOnCurrentPage, t, appTexts]);

  const handleReset = useCallback(() => {
    setUserName(''); setUserEmail(''); setAnswers({}); setResults(null); setCurrentPageIndex(0);
    setSaveError(undefined); setDevelopmentPlan(null); setPlanLoadingError(null); setPlanSavingError(null); setGeneralLoadingError(null);
    setCurrentStep(AppStep.Welcome); window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadDevelopmentPlanByEmail = useCallback(async (emailForPlan: string) => {
    setIsPlanLoading(true); setPlanLoadingError(null); setUserEmail(emailForPlan); 
    let loadedUserResult: UserResult | null = null;
    let planDocId = sanitizeFirestoreId(emailForPlan);
    try {
      const resultsQuery = query(collection(db, "spiritualGiftResults"), where("userEmail", "==", emailForPlan), orderBy("createdAt", "desc"), limit(1));
      const querySnapshot = await getDocs(resultsQuery);
      if (!querySnapshot.empty) {
        const resultDoc = querySnapshot.docs[0]; const resultData = resultDoc.data();
        loadedUserResult = { id: resultDoc.id, name: resultData.name, userEmail: resultData.userEmail, topGifts: resultData.topGifts, allScores: resultData.allScores, createdAt: (resultData.createdAt as Timestamp)?.toDate ? (resultData.createdAt as Timestamp).toDate() : new Date() };
        setResults(loadedUserResult); setUserName(loadedUserResult.name); 
      } else {
        setPlanLoadingError(appTexts.noResultsForEmail); setIsPlanLoading(false); setDevelopmentPlan(null); return;
      }
      const planDocRef = doc(db, "developmentPlans", planDocId); const planDocSnap = await getDoc(planDocRef);
      const currentTopGiftsText = (loadedUserResult?.topGifts && Array.isArray(loadedUserResult.topGifts)) ? loadedUserResult.topGifts.map(g => getLocalizedGiftName(g.gift.name)).join(', ') : t({en: 'Primary gifts not available', es: 'Dones principales no disponibles'});
      if (planDocSnap.exists()) {
        const loadedPlan = planDocSnap.data() as DevelopmentPlanData;
        setDevelopmentPlan({ ...initialDevelopmentPlanData, ...loadedPlan, step1_primaryGifts: loadedPlan.step1_primaryGifts || currentTopGiftsText });
      } else {
        setDevelopmentPlan({ ...initialDevelopmentPlanData, step1_primaryGifts: currentTopGiftsText });
      }
      setCurrentStep(AppStep.DevelopmentGuide);
    } catch (error) {
      console.error(`Error loading data for email: '${emailForPlan}', Plan Doc ID: '${planDocId}'. Firestore error:`, error);
      setPlanLoadingError(appTexts.errorLoadingData); setDevelopmentPlan(null); 
    } finally { setIsPlanLoading(false); }
  }, [getLocalizedGiftName, t, appTexts]);
  
  const loadOrCreateDevelopmentPlan = useCallback(async () => {
    if (!userEmail) { setPlanLoadingError(appTexts.userEmailNotAvailableLoad); setDevelopmentPlan(initialDevelopmentPlanData); return; }
    if (!results || !results.name) { setPlanLoadingError(appTexts.resultsNotAvailableLoadCreate); setDevelopmentPlan(initialDevelopmentPlanData); return; }
    setIsPlanLoading(true); setPlanLoadingError(null); const planDocId = sanitizeFirestoreId(userEmail); 
    try {
      const planDocRef = doc(db, "developmentPlans", planDocId); const planDocSnap = await getDoc(planDocRef);
      const currentTopGiftsText = (results.topGifts && Array.isArray(results.topGifts)) ? results.topGifts.map(g => getLocalizedGiftName(g.gift.name)).join(', ') : t({en: 'Primary gifts not available', es: 'Dones principales no disponibles'});
      if (planDocSnap.exists()) {
        const loadedPlan = planDocSnap.data() as DevelopmentPlanData;
        setDevelopmentPlan({ ...initialDevelopmentPlanData, ...loadedPlan, step1_primaryGifts: loadedPlan.step1_primaryGifts || currentTopGiftsText });
      } else {
        setDevelopmentPlan({ ...initialDevelopmentPlanData, step1_primaryGifts: currentTopGiftsText });
      }
    } catch (error) {
      console.error(`Error loading dev plan for ${userEmail}, ID: ${planDocId}. Firestore error:`, error);
      setPlanLoadingError(appTexts.errorLoadingDevPlan);
      const fallbackTopGiftsText = (results?.topGifts && Array.isArray(results.topGifts)) ? results.topGifts.map(g => getLocalizedGiftName(g.gift.name)).join(', ') : t({en: 'Primary gifts not available', es: 'Dones principales no disponibles'});
      setDevelopmentPlan({ ...initialDevelopmentPlanData, step1_primaryGifts: fallbackTopGiftsText });
    } finally { setIsPlanLoading(false); }
  }, [results, userEmail, getLocalizedGiftName, t, appTexts]);

  const handleNavigateToDevelopmentGuide = useCallback(() => {
    if (!userEmail || !results) { setCurrentStep(AppStep.IdentifyForDevelopment); setGeneralLoadingError(appTexts.enterEmailToLoadPlan); return; }
    setCurrentStep(AppStep.DevelopmentGuide); loadOrCreateDevelopmentPlan(); 
  }, [userEmail, results, loadOrCreateDevelopmentPlan, appTexts.enterEmailToLoadPlan]);
  
  const handleDevelopmentPlanChange = useCallback((fieldName: keyof DevelopmentPlanData, value: any) => {
    setDevelopmentPlan(prev => {
      const basePlan = prev ?? initialDevelopmentPlanData;
      if (fieldName === 'step2_categories') return { ...basePlan, step2_categories: { ...basePlan.step2_categories, ...value }};
      return { ...basePlan, [fieldName]: value };
    });
  }, []);

  const saveDevelopmentPlan = useCallback(async () => {
    if (!developmentPlan || !userEmail) { setPlanSavingError(appTexts.noPlanOrEmailMissing); return; }
    setIsPlanSaving(true); setPlanSavingError(null); const planDocId = sanitizeFirestoreId(userEmail); 
    try {
      const planDocRef = doc(db, "developmentPlans", planDocId);
      await setDoc(planDocRef, { ...developmentPlan, userEmail: userEmail, userName: userName, lastUpdated: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error(`Error saving dev plan for ${userEmail}, ID: ${planDocId}. Firestore error:`, error);
      setPlanSavingError(appTexts.errorSavingDevPlan);
    } finally { setIsPlanSaving(false); }
  }, [developmentPlan, userEmail, userName, appTexts]);

  const handleNavigateToResults = useCallback(() => {
    if (results) { setCurrentStep(AppStep.Results); } 
    else { setCurrentStep(AppStep.IdentifyForQuiz); setGeneralLoadingError(appTexts.noResultsToDisplay); }
  }, [results, appTexts.noResultsToDisplay]);

  // Explicitly type the translated saveError for ResultsDisplay
  const saveErrorForDisplay: string | undefined = saveError ? t(saveError) : undefined;
  const planLoadingErrorForDisplay: string | null = planLoadingError ? t(planLoadingError) : null;
  const planSavingErrorForDisplay: string | null = planSavingError ? t(planSavingError) : null;
  const generalLoadingErrorForDisplay: string | null = generalLoadingError ? t(generalLoadingError) : null;


  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 py-6 sm:py-12">
      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-sky-800 text-center tracking-tight">
          <i className="fas fa-bible mr-3 text-sky-600"></i>
          {t(appTexts.discoverGiftsHeader)}
        </h1>
        <LanguageSwitcher />
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {generalLoadingErrorForDisplay && (
             <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-center">
                <p className="text-yellow-700 font-semibold"> <i className="fas fa-info-circle mr-2"></i> {generalLoadingErrorForDisplay} </p>
             </div>
        )}
        {currentStep === AppStep.Welcome && <WelcomeScreen onNavigateToQuizIdentification={handleNavigateToQuizIdentification} onNavigateToDevelopmentIdentification={handleNavigateToDevelopmentIdentification} />}
        {currentStep === AppStep.IdentifyForQuiz && <IdentifyForQuizScreen onProceed={handleProceedToQuiz} onBack={handleBackToWelcome} />}
        {currentStep === AppStep.IdentifyForDevelopment && <IdentifyForDevelopmentScreen onLoadPlan={loadDevelopmentPlanByEmail} onBack={handleBackToWelcome} isLoading={isPlanLoading} error={planLoadingErrorForDisplay} />}
        {currentStep === AppStep.Form && <QuestionnaireForm questions={currentQuestions} answers={answers} onAnswerChange={handleAnswerChange} onSubmit={handleSubmit} onNextPage={handleNextPage} onPrevPage={handlePrevPage} isFormDisabled={false} canProceed={canProceedOnCurrentPage} currentPageIndex={currentPageIndex} totalPages={totalPages} />}
        {currentStep === AppStep.Calculating && <div className="flex flex-col items-center justify-center h-64 bg-white shadow-xl rounded-lg p-8"> <i className="fas fa-cog fa-spin text-5xl text-sky-600 mb-6" aria-hidden="true"></i> <p className="text-2xl font-semibold text-sky-700">{t(appTexts.calculatingResults)}</p> </div>}
        {currentStep === AppStep.Saving && <div className="flex flex-col items-center justify-center h-64 bg-white shadow-xl rounded-lg p-8"> <i className="fas fa-cloud-upload-alt fa-spin text-5xl text-sky-600 mb-6" aria-hidden="true"></i> <p className="text-2xl font-semibold text-sky-700">{t(appTexts.savingResults)}</p> </div>}
        {currentStep === AppStep.Results && results && <ResultsDisplay result={{...results, saveError: saveErrorForDisplay }} onReset={handleReset} onNavigateToDevelopmentGuide={handleNavigateToDevelopmentGuide} />}
        {currentStep === AppStep.DevelopmentGuide && results && developmentPlan && <SpiritualGiftsDevelopmentGuide userName={results.name} topGifts={results.topGifts} planData={developmentPlan} onPlanChange={handleDevelopmentPlanChange} onSavePlan={saveDevelopmentPlan} onReset={handleReset} onNavigateToResults={handleNavigateToResults} isLoading={isPlanLoading} isSaving={isPlanSaving} loadError={planLoadingErrorForDisplay} saveError={planSavingErrorForDisplay} />}
        {currentStep === AppStep.DevelopmentGuide && (!results || !developmentPlan) && !isPlanLoading && ( 
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-md shadow-lg text-center">
                <strong className="font-bold">{t(appTexts.information)}</strong>
                <span className="block sm:inline"> {planLoadingErrorForDisplay ? planLoadingErrorForDisplay : t(appTexts.couldNotLoadDevPlan)}</span>
                 <div className="mt-4 space-x-2">
                    <button onClick={handleBackToWelcome} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">{t(appTexts.goToHome)}</button>
                    {results && <button onClick={handleNavigateToResults} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">{t(appTexts.backToResults)}</button>}
                 </div>
            </div>
        )}
      </main>
      <footer className="text-center py-8 mt-12 border-t border-gray-300">
        <p className="text-sm text-gray-500"> {t(appTexts.footerText)} &copy; {new Date().getFullYear()} </p>
      </footer>
    </div>
  );
};

export default App;
