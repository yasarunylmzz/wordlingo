import type { LearningLevel, StudyCard } from "./types";

export const LEVELS: LearningLevel[] = [0, 1, 2, 3];

/** Fixed product gaps. Not a memory model and not multiplied by importance. */
export const BASE_INTERVAL_DAYS: Record<LearningLevel, number> = {
  0: 0,
  1: 1,
  2: 4,
  3: 14,
};

/** Level 3 doubles 14 → 28 → 56, then stops here. */
export const MAX_INTERVAL_DAYS = 90;

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

function increaseLevel(level: LearningLevel): LearningLevel {
  if (level === 0) return 1;
  if (level === 1) return 2;
  if (level === 2) return 3;
  return 3;
}

export function toLevel(value: number): LearningLevel {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  return 3;
}

export function startOfLocalDay(now: number): number {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Level 0 is due the same day (`dueAt = now`, interval 0). The in-session
 * retry is separate. A card that is still level 0 after that timestamp is
 * due again the next day because `dueAt <= now` stays true.
 * Levels 1–3 use exact day multiples from `now`.
 */
function scheduleDue(
  level: LearningLevel,
  intervalDays: number,
  now: number
): { dueAt: number; intervalDays: number } {
  if (level === 0) {
    return { dueAt: now, intervalDays: 0 };
  }
  return { dueAt: now + intervalDays * MS_PER_DAY, intervalDays };
}

function intervalAfterCorrect(card: StudyCard): number {
  if (card.learningLevel < 3) {
    return BASE_INTERVAL_DAYS[increaseLevel(card.learningLevel)];
  }
  const base = BASE_INTERVAL_DAYS[3];
  if (card.intervalDays < base) return base;
  return Math.min(MAX_INTERVAL_DAYS, card.intervalDays * 2);
}

/** Climb exactly one step. A prior wrong answer does not block the climb. */
export function applyCorrect(card: StudyCard, now = Date.now()): StudyCard {
  const learningLevel = increaseLevel(card.learningLevel);
  const scheduled = scheduleDue(learningLevel, intervalAfterCorrect(card), now);
  return {
    ...card,
    correctCount: card.correctCount + 1,
    learningLevel,
    lastStudiedAt: now,
    dueAt: scheduled.dueAt,
    intervalDays: scheduled.intervalDays,
  };
}

/**
 * Drop exactly one step and write that step's base interval.
 * A doubled level-3 gap is not carried down.
 */
export function applyWrong(card: StudyCard, now = Date.now()): StudyCard {
  const learningLevel = decreaseLevel(card.learningLevel);
  const scheduled = scheduleDue(
    learningLevel,
    BASE_INTERVAL_DAYS[learningLevel],
    now
  );
  return {
    ...card,
    wrongCount: card.wrongCount + 1,
    learningLevel,
    lastStudiedAt: now,
    dueAt: scheduled.dueAt,
    intervalDays: scheduled.intervalDays,
  };
}

export function setLevel(
  card: StudyCard,
  learningLevel: LearningLevel,
  now = Date.now()
): StudyCard {
  const scheduled = scheduleDue(
    learningLevel,
    BASE_INTERVAL_DAYS[learningLevel],
    now
  );
  return {
    ...card,
    learningLevel,
    lastStudiedAt: now,
    dueAt: scheduled.dueAt,
    intervalDays: scheduled.intervalDays,
  };
}

export function isMastered(card: StudyCard): boolean {
  return card.learningLevel === 3;
}
