import type { LearningLevel, StudyCard } from "./types";

export const LEVELS: LearningLevel[] = [0, 1, 2, 3];

export const LEVEL_META: Record<
  LearningLevel,
  { label: string; short: string; color: string; soft: string }
> = {
  0: {
    label: "Yeni karşılaştım",
    short: "Yeni",
    color: "#8F4717",
    soft: "#F4E6D8",
  },
  1: {
    label: "Çoğu zaman hatırlıyorum",
    short: "Tanıdık",
    color: "#1D4ED8",
    soft: "#E0E7F8",
  },
  2: {
    label: "Öğreniyorum",
    short: "Öğreniyorum",
    color: "#0B6B55",
    soft: "#DBEFE7",
  },
  3: {
    label: "Tamamen öğrendim",
    short: "Öğrendim",
    color: "#166534",
    soft: "#DCEFE2",
  },
};

export function decreaseLevel(level: LearningLevel): LearningLevel {
  if (level === 0) return 0;
  if (level === 1) return 0;
  if (level === 2) return 1;
  return 2;
}

export function toLevel(value: number): LearningLevel {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  return 3;
}

/** Promote to mastered (3) after three clean corrects with zero wrongs. */
export function applyCorrect(card: StudyCard, now = Date.now()): StudyCard {
  const correctCount = card.correctCount + 1;
  const learningLevel: LearningLevel =
    card.wrongCount === 0 && correctCount > 2 ? 3 : card.learningLevel;
  return { ...card, correctCount, learningLevel, lastStudiedAt: now };
}

export function applyWrong(card: StudyCard, now = Date.now()): StudyCard {
  return {
    ...card,
    wrongCount: card.wrongCount + 1,
    learningLevel: decreaseLevel(card.learningLevel),
    lastStudiedAt: now,
  };
}

export function setLevel(
  card: StudyCard,
  learningLevel: LearningLevel,
  now = Date.now()
): StudyCard {
  return { ...card, learningLevel, lastStudiedAt: now };
}

export function isMastered(card: StudyCard): boolean {
  return card.learningLevel === 3;
}
