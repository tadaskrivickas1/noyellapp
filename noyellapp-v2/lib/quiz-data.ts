import { Question, InsightData } from './quiz-types';

// ─────────────────────────────────────────────────────────────
// QUESTIONS
// Edit this file to rephrase questions or change options.
// ─────────────────────────────────────────────────────────────

export const QUESTIONS: Record<string, Question> = {
  q1: {
    id: 'q1',
    number: 1,
    title: 'What age is your child?',
    type: 'single',
    nextScreen: 'q2',
    options: [
      { value: '3-5',   label: '3 – 5 years old',   emoji: '🌱' },
      { value: '6-10',  label: '6 – 10 years old',  emoji: '🎒' },
      { value: '11-14', label: '11 – 14 years old', emoji: '🎧' },
      { value: '15-18', label: '15 – 18 years old', emoji: '🌟' },
    ],
  },

  q2: {
    id: 'q2',
    number: 2,
    title: 'What feels hardest in your home right now?',
    type: 'single',
    nextScreen: 'q3',
    options: [
      { value: 'tension',  label: 'Emotional tension & yelling',     emoji: '🏠' },
      { value: 'mornings', label: 'Chaotic mornings & transitions',  emoji: '⏰' },
      { value: 'listen',   label: 'Getting your child to listen',    emoji: '🧠' },
      { value: 'school',   label: 'School stress & performance',     emoji: '📚' },
    ],
    whyNote: 'Different kids have different nervous-system patterns. This helps us tailor your results.',
  },

  q3: {
    id: 'q3',
    number: 3,
    title: 'How chaotic does your home feel during stressful times?',
    subtitle: 'From 1 (very calm) to 10 (complete chaos)',
    type: 'slider',
    nextScreen: 'q4',
    sliderMin: 1,
    sliderMax: 10,
    sliderDefault: 5,
    sliderLabelMin: 'Very calm',
    sliderLabelMax: 'Complete chaos',
    sliderEmojiMin: '😌',
    sliderEmojiMax: '😤',
  },

  q4: {
    id: 'q4',
    number: 4,
    title: 'When your child "loses control," what usually triggers it?',
    type: 'multi',
    nextScreen: 'q5',
    options: [
      { value: 'transitions',    label: 'Transitions (stopping play, leaving, bedtime)', emoji: '🧩' },
      { value: 'overstimulation', label: 'Overstimulation (noise, crowds, siblings)',    emoji: '🔊' },
      { value: 'boredom',        label: 'Waiting / boredom',                            emoji: '⏳' },
      { value: 'correction',     label: 'Being told "no" or corrected',                 emoji: '❌' },
      { value: 'unpredictable',  label: 'It feels unpredictable',                       emoji: '🤷' },
    ],
  },

  q5: {
    id: 'q5',
    number: 5,
    title: 'Which of these have you tried, but they stopped working?',
    type: 'multi',
    nextScreen: 'q6',
    options: [
      { value: 'stickers',    label: 'Sticker Charts / Reward Systems',           emoji: '⭐' },
      { value: 'timeouts',    label: 'Time-outs',                                 emoji: '⏱️' },
      { value: 'screens',     label: 'Taking away screens / privileges',          emoji: '🚫' },
      { value: 'gentle',      label: 'Gentle Parenting / Talking it out',         emoji: '💬' },
      { value: 'yelling',     label: 'Yelling (I don\'t want to, but it happens)', emoji: '😤' },
    ],
  },

  q6: {
    id: 'q6',
    number: 6,
    title: 'Is "screens off" one of the biggest triggers in your home?',
    type: 'yesno',
    nextScreen: 'q7',
    whyNote: 'Did you know? For many kids, screens calm the nervous system — so stopping can feel like a sudden drop.',
  },

  q7: {
    id: 'q7',
    number: 7,
    title: 'Do you find yourself repeating requests 2–3 times when your child is absorbed in something?',
    subtitle: 'TikTok, games, hobbies, etc.',
    type: 'yesno',
    nextScreen: 'insight1',
    whyNote: 'Did you know? This often isn\'t "not listening" — it\'s an attention "tunnel." Kids like this do better with specific transition steps that reduce conflict.',
  },

  q8: {
    id: 'q8',
    number: 8,
    title: 'Does your child react to your tone of voice more than your actual words?',
    type: 'yesno',
    nextScreen: 'insight2',
  },

  q9: {
    id: 'q9',
    number: 9,
    title: 'True or false: You often go to bed feeling guilty after a hard day with your child.',
    type: 'yesno',
    nextScreen: 'insight3',
    options: [
      { value: 'true',  label: 'True',  emoji: '✅' },
      { value: 'false', label: 'False', emoji: '❌' },
    ],
  },

  q10: {
    id: 'q10',
    number: 10,
    title: 'When your child gets upset, what happens first?',
    type: 'single',
    nextScreen: 'social',
    options: [
      { value: 'explode',   label: 'They explode fast (yelling, crying, throwing)', emoji: '💥' },
      { value: 'pushback',  label: 'They argue / push back ("No!", "Leave me!")',   emoji: '🛑' },
      { value: 'shutdown',  label: 'They shut down (silent, "I don\'t know")',       emoji: '🤐' },
      { value: 'cling',     label: 'They cling or beg (needs you close)',            emoji: '🫂' },
      { value: 'escape',    label: 'They run / escape (hides, wants to disappear)', emoji: '🏃' },
    ],
  },

  q11: {
    id: 'q11',
    number: 11,
    title: 'Which concern feels closest to you about your child\'s future?',
    type: 'single',
    nextScreen: 'q12',
    options: [
      { value: 'school',    label: 'School success and learning',         emoji: '🎓' },
      { value: 'social',    label: 'Friendships and social confidence',   emoji: '🤝' },
      { value: 'emotional', label: 'Emotional well-being and self-esteem', emoji: '❤️' },
      { value: 'all',       label: 'I worry about all of it',             emoji: '😟' },
    ],
  },

  q12: {
    id: 'q12',
    number: 12,
    title: 'We know parenting under stress is exhausting. If we gave you a plan broken into 5-minute micro-steps, could you commit to it daily?',
    type: 'yesno',
    nextScreen: 'q13',
  },

  q13: {
    id: 'q13',
    number: 13,
    title: 'One rule doesn\'t fit every child — like one shoe doesn\'t fit every foot. Agree?',
    type: 'yesno',
    nextScreen: 'q14',
    options: [
      { value: 'yes', label: 'Yes, I agree', emoji: '✅' },
      { value: 'no',  label: 'Not sure',     emoji: '🤔' },
    ],
  },

  q14: {
    id: 'q14',
    number: 14,
    title: 'Last Question: Are you ready to stop the yelling and bring peace to your home in the next 28 days?',
    subtitle: 'Press YES to start your journey',
    type: 'pulse',
    nextScreen: 'confetti',
  },
};

// ─────────────────────────────────────────────────────────────
// INSIGHT SCREENS
// ─────────────────────────────────────────────────────────────

export const INSIGHTS: Record<string, InsightData> = {
  insight1: {
    id: 'insight1',
    iconBg: '#FDECEA',
    iconEmoji: '💔',
    title: 'If your child looks like they "don\'t care" — this is why.',
    body: 'Shutting down is often a stress response. It\'s the brain trying to protect itself by going quiet.\n\nNot disrespect. Not coldness.\n\nA different approach works better than pushing harder.',
    nextScreen: 'q8',
    buttonLabel: 'I understand, continue',
  },

  insight2: {
    id: 'insight2',
    iconBg: '#E8F4FD',
    iconEmoji: '🔁',
    title: 'Same child. Different trigger. Different reaction.',
    body: 'That\'s because their nervous system has a pattern.\n\nWhen you spot the pattern, you can calm things down sooner — without yelling.',
    nextScreen: 'q9',
    buttonLabel: 'I understand, continue',
  },

  insight3: {
    id: 'insight3',
    iconBg: '#EEE8F8',
    iconEmoji: '🧠',
    title: 'Yelling doesn\'t just hurt the moment.',
    body: 'Over time, it can wire a child\'s brain for stress, making self-control skills harder to build.\n\nOur daily tools can help your child calm their nervous system through gentle techniques like:',
    checkList: [
      'Movement breaks',
      'Simple breathing techniques',
      'Sensory resets',
      'Grounding exercises',
    ],
    nextScreen: 'q10',
    buttonLabel: 'I understand, continue',
  },
};
