import type { Card } from "../../types/cardAndDesk";
import type { CardLearningState, StudyCard } from "./types";

export function defaultLearningState(
  cardId: string,
  deskId: string
): CardLearningState {
  return {
    cardId,
    deskId,
    learningLevel: 0,
    correctCount: 0,
    wrongCount: 0,
    isHard: false,
    lastStudiedAt: 0,
  };
}

export function mergeCardWithLearning(
  card: Card,
  state?: CardLearningState
): StudyCard {
  const learning = state ?? defaultLearningState(card.id, card.deskID);
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
  };
}
