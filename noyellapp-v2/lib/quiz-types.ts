export type ScreenId =
  | 'hero'
  | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7'
  | 'insight1'
  | 'q8'
  | 'insight2'
  | 'q9'
  | 'insight3'
  | 'q10'
  | 'social'
  | 'q11' | 'q12' | 'q13' | 'q14'
  | 'confetti'
  | 'results'
  | 'summary'
  | 'builder'
  | 'email'
  | 'sales'
  | 'checkout'
  | 'success';

export type QuestionType = 'single' | 'multi' | 'yesno' | 'slider' | 'pulse';

export interface Option {
  value: string;
  label: string;
  emoji?: string;
}

export interface Question {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: Option[];
  nextScreen: ScreenId | ((value: string) => ScreenId);
  whyNote?: string;
  /** For slider type */
  sliderMin?: number;
  sliderMax?: number;
  sliderDefault?: number;
  sliderLabelMin?: string;
  sliderLabelMax?: string;
  sliderEmojiMin?: string;
  sliderEmojiMax?: string;
}

export interface InsightData {
  id: string;
  iconBg: string;
  iconEmoji: string;
  title: string;
  body: string;
  checkList?: string[];
  nextScreen: ScreenId;
  buttonLabel?: string;
}

export interface QuizState {
  currentScreen: ScreenId;
  history: ScreenId[];
  answers: Record<string, string | string[]>;
  gender: 'boy' | 'girl' | null;
  email: string;
  plan: '1wk' | '4wk' | '12wk';
}

export type QuizAction =
  | { type: 'GO_TO'; screen: ScreenId }
  | { type: 'GO_BACK' }
  | { type: 'SET_GENDER'; gender: 'boy' | 'girl' }
  | { type: 'SET_ANSWER'; questionId: string; value: string | string[] }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_PLAN'; plan: '1wk' | '4wk' | '12wk' };

/** Ordered screens used for progress bar calculation */
export const QUIZ_SCREENS: ScreenId[] = [
  'hero', 'q1', 'q2', 'q3', 'q4', 'q5',
  'q6', 'q7', 'insight1', 'q8', 'insight2',
  'q9', 'insight3', 'q10', 'q11',
  'q12', 'q13', 'q14',
];

export const PLAN_DATA: Record<string, { label: string; price: string; orig: string; total: string; renewal: string; perDay: string }> = {
  '1wk':  { label: '1-week plan (first 7 days)',    price: '$8.18',  orig: '$20.97', total: '$8.18',  renewal: 'Then regular price $20.97', perDay: '$1.17' },
  '4wk':  { label: '4-week plan (first month)',     price: '$17.92', orig: '$45.96', total: '$17.92', renewal: 'Then regular price $45.96', perDay: '$0.64' },
  '12wk': { label: '12-week plan (first 3 months)', price: '$29.74', orig: '$78.85', total: '$29.74', renewal: 'Then regular price $78.85', perDay: '$0.35' },
};
