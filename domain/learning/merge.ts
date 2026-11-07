import { toLevel } from "./level";
import type { Card } from "../../types/cardAndDesk";
import type { CardLearningState, StudyCard } from "./types";

export function defaultLearningState(
  cardId: string,
  deskId: string,
  now = Date.now()
): CardLearningState {
  return {
    cardId,
    deskId,
    learningLevel: 0,
    correctCount: 0,
    wrongCount: 0,
    isHard: false,
    lastStudiedAt: 0,
    dueAt: now,
    intervalDays: 0,
  };
}

/**
 * Older saves have no schedule. Missing `dueAt` means due now so the card
 * shows up in Bugün once; the next review writes a real gap.
 * Missing `intervalDays` stays 0 so a level-3 card starts at 14, not 28.
 */
export function migrateLearningState(
  state: Partial<CardLearningState> & Pick<CardLearningState, "cardId" | "deskId">,
  now = Date.now()
): CardLearningState {
  const learningLevel = toLevel(state.learningLevel ?? 0);
  const dueMissing = typeof state.dueAt !== "number";
  const intervalMissing = typeof state.intervalDays !== "number";
  const levelNeedsClamp = state.learningLevel !== learningLevel;
  if (!dueMissing && !intervalMissing && !levelNeedsClamp) {
    return state as CardLearningState;
  }
  return {
    cardId: state.cardId,
    deskId: state.deskId,
    learningLevel,
    correctCount: state.correctCount ?? 0,
    wrongCount: state.wrongCount ?? 0,
    isHard: Boolean(state.isHard),
    lastStudiedAt: state.lastStudiedAt ?? 0,
    dueAt: dueMissing ? now : (state.dueAt as number),
    intervalDays: intervalMissing ? 0 : (state.intervalDays as number),
  };
}

export function mergeCardWithLearning(
  card: Card,
  state?: CardLearningState,
  now = Date.now()
): StudyCard {
  const learning = state
    ? migrateLearningState(state, now)
    : defaultLearningState(card.id, card.deskID, now);
  return {
    id: card.id,
    deskId: card.deskID,
    word1: card.word1,
    word2: card.word2,
    learningLevel: learning.learningLevel,
    correctCount: learning.correctCount,
    wrongCount: learning.wrongCount,
    isHard: learning.isHard,
    lastStudiedAt: learning.lastStudiedAt,
    dueAt: learning.dueAt,
    intervalDays: learning.intervalDays,
  };
}

export function learningStateFromStudyCard(
  card: StudyCard
): CardLearningState {
  return {
    cardId: card.id,
    deskId: card.deskId,
    learningLevel: card.learningLevel,
    correctCount: card.correctCount,
    wrongCount: card.wrongCount,
    isHard: card.isHard,
    lastStudiedAt: card.lastStudiedAt,
    dueAt: card.dueAt,
    intervalDays: card.intervalDays,
  };
}
