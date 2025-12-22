export interface McqChoice {
  text: string;
  isCorrect?: boolean; // Optional, can be used if we want to mark it beforehand
}

export interface McqExercise {
  prompt: string;
  choices: string[];
  answerIndex: number;
  rationale?: string;
  contextText?: string;
  sourceRef?: {
    text: string;
  };
}

export interface ExerciseProgress {
  current: number;
  total: number;
}

export interface FillBlankExerciseItem {
  maskedText: string;
  answer: string;
}

