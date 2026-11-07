/** Learning ladder 0–3 with fixed due gaps. Not Anki SM-2 and not FSRS. */
export type LearningLevel = 0 | 1 | 2 | 3;

/** `today` is the due queue. Wrong and hard stay optional filters. */
export type StudyMode = "today" | "normal" | "wrong" | "hard" | "review";

/** Phase 1 exercises; more modes land in later phases. */
export type StudyExercise = "study" | "quiz" | "flip";

export type QuizDirection = "w1-w2" | "w2-w1";

/**
 * Persisted progress for one card (separate from API Card content).
 * One schedule per card — quiz direction does not get its own due date.
 */
export interface CardLearningState {
  cardId: string;
  deskId: string;
  learningLevel: LearningLevel;
  correctCount: number;
  wrongCount: number;
  isHard: boolean;
  lastStudiedAt: number;
  /** Epoch ms. Daily queue is `dueAt <= now`. */
  dueAt: number;
  /**
   * Days until the next due date. Level 3 doubling is remembered here.
   * This is not an SM-2 ease factor.
   */
  intervalDays: number;
}

/**
 * Card content + learning fields used by pure domain functions.
 * Adapted from VB `Word` (eng/tr → word1/word2, unitId → deskId).
 */
export interface StudyCard {
  id: string;
  deskId: string;
  word1: string;
  word2: string;
  learningLevel: LearningLevel;
  correctCount: number;
  wrongCount: number;
  isHard: boolean;
  lastStudiedAt: number;
  dueAt: number;
  intervalDays: number;
}

export interface StudySessionConfig {
  deskId: string;
  mode: StudyMode;
  exercise: StudyExercise;
  quizDirection: QuizDirection;
  limit: number;
  shuffle: boolean;
  hideMastered: boolean;
}

export interface StudySessionSummary {
  deskId: string;
  exercise: StudyExercise;
  mode: StudyMode;
  correct: number;
  wrong: number;
  total: number;
  points: number;
  durationMs: number;
}

export interface LearningStats {
  totalCards: number;
  mastered: number;
  hardCards: number;
  sessions: number;
  streak: number;
  studyMinutes: number;
}
