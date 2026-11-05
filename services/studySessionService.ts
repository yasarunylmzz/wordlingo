import { selectSessionCards } from "../domain/learning/session";
import { mergeCardWithLearning } from "../domain/learning/merge";
import type {
  StudyCard,
  StudySessionConfig,
  StudySessionSummary,
} from "../domain/learning/types";
import { useCardStore } from "../stores/cardStore";
import { useLearningStore } from "../stores/learningStore";

export type LoadedStudySession = {
  pool: StudyCard[];
  cards: StudyCard[];
  config: StudySessionConfig;
};

/**
 * Load desk cards, merge learning state, and select a session list.
 * Pure selection is domain-side; this wires stores.
 */
export function loadSession(config: StudySessionConfig): LoadedStudySession {
  const rawCards = useCardStore.getState().getCards(config.deskId);
  useLearningStore.getState().seedDeskCards(config.deskId, rawCards);

  const byCardId = useLearningStore.getState().byCardId;
  const pool = rawCards.map((card) =>
    mergeCardWithLearning(card, byCardId[card.id])
  );
  const cards = selectSessionCards(pool, config);
  return { pool, cards, config };
}

/**
 * Persist session summary + study day / minutes into learning store.
 * No cloud sync in Phase 1.
 */
export function finishSession(summary: StudySessionSummary): void {
  const store = useLearningStore.getState();
  store.recordSession(summary);
  store.addStudyTime(summary.durationMs);
  store.markStudied();
}
