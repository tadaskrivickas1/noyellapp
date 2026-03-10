'use client';

import { useCallback, useReducer } from 'react';
import { QuizState, QuizAction, ScreenId } from '@/lib/quiz-types';
import { QUESTIONS, INSIGHTS } from '@/lib/quiz-data';

import QuizShell from '@/components/quiz/QuizShell';
import HeroScreen from '@/components/quiz/screens/HeroScreen';
import QuestionScreen from '@/components/quiz/screens/QuestionScreen';
import InsightScreen from '@/components/quiz/screens/InsightScreen';
import SocialScreen from '@/components/quiz/screens/SocialScreen';
import ConfettiScreen from '@/components/quiz/screens/ConfettiScreen';
import ResultsScreen from '@/components/quiz/screens/ResultsScreen';
import SummaryScreen from '@/components/quiz/screens/SummaryScreen';
import BuilderScreen from '@/components/quiz/screens/BuilderScreen';
import EmailScreen from '@/components/quiz/screens/EmailScreen';
import SalesScreen from '@/components/quiz/screens/SalesScreen';
import CheckoutScreen from '@/components/quiz/screens/CheckoutScreen';
import SuccessScreen from '@/components/quiz/screens/SuccessScreen';

const initialState: QuizState = {
  currentScreen: 'hero',
  history: ['hero'],
  answers: {},
  gender: null,
  email: '',
  plan: '4wk',
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'GO_TO':
      return {
        ...state,
        currentScreen: action.screen,
        history: [...state.history, action.screen],
      };
    case 'GO_BACK': {
      if (state.history.length <= 1) return state;
      const newHistory = state.history.slice(0, -1);
      return {
        ...state,
        currentScreen: newHistory[newHistory.length - 1],
        history: newHistory,
      };
    }
    case 'SET_GENDER':
      return { ...state, gender: action.gender };
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };
    case 'SET_EMAIL':
      return { ...state, email: action.email };
    case 'SET_PLAN':
      return { ...state, plan: action.plan };
    default:
      return state;
  }
}

export default function OnboardingPage() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const goTo = useCallback((screen: string) => {
    dispatch({ type: 'GO_TO', screen: screen as ScreenId });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  function handleGender(gender: 'boy' | 'girl') {
    dispatch({ type: 'SET_GENDER', gender });
    goTo('q1');
  }

  function handleAnswer(questionId: string, value: string | string[], nextScreen: string) {
    dispatch({ type: 'SET_ANSWER', questionId, value });
    goTo(nextScreen);
  }

  function handleEmail(email: string, nextScreen: string) {
    dispatch({ type: 'SET_EMAIL', email });
    goTo(nextScreen);
  }

  function handleSelectPlan(plan: '1wk' | '4wk' | '12wk') {
    dispatch({ type: 'SET_PLAN', plan });
  }

  function handleOrder() {
    goTo('checkout');
  }

  const screen = state.currentScreen;

  // Question screens
  const questionIds = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13'];
  const isQuestion = questionIds.includes(screen);

  // Insight screens
  const insightIds = ['insight1','insight2','insight3'];
  const isInsight = insightIds.includes(screen);

  return (
    <QuizShell currentScreen={state.currentScreen} onBack={goBack}>
      {screen === 'hero' && (
        <HeroScreen onSelectGender={handleGender} />
      )}

      {isQuestion && QUESTIONS[screen] && (
        <QuestionScreen
          key={screen}
          question={QUESTIONS[screen]}
          savedAnswer={state.answers[screen]}
          onAnswer={(value, nextScreen) => handleAnswer(screen, value, nextScreen)}
        />
      )}

      {isInsight && INSIGHTS[screen] && (
        <InsightScreen
          key={screen}
          insight={INSIGHTS[screen]}
          onContinue={goTo}
        />
      )}

      {screen === 'social' && (
        <SocialScreen onContinue={goTo} />
      )}

      {screen === 'confetti' && (
        <ConfettiScreen onDone={() => goTo('results')} />
      )}

      {screen === 'results' && (
        <ResultsScreen onContinue={goTo} />
      )}

      {screen === 'summary' && (
        <SummaryScreen onContinue={goTo} />
      )}

      {screen === 'builder' && (
        <BuilderScreen key="builder" onContinue={goTo} />
      )}

      {screen === 'email' && (
        <EmailScreen onSubmit={handleEmail} />
      )}

      {screen === 'sales' && (
        <SalesScreen
          plan={state.plan}
          onSelectPlan={handleSelectPlan}
          onOrder={handleOrder}
        />
      )}

      {screen === 'checkout' && (
        <CheckoutScreen
          plan={state.plan}
          onBack={() => goTo('sales')}
          onSuccess={() => goTo('success')}
        />
      )}

      {screen === 'success' && (
        <SuccessScreen />
      )}
    </QuizShell>
  );
}
