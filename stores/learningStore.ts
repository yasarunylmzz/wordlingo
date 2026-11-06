import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import type { Card } from "../types/cardAndDesk";
import {
  applyCorrect as domainApplyCorrect,
  applyWrong as domainApplyWrong,
  setLevel as domainSetLevel,
} from "../domain/learning/level";
import {
  defaultLearningState,
  learningStateFromStudyCard,
  mergeCardWithLearning,
  migrateLearningState,
} from "../domain/learning/merge";
import { masteredCount, streakFromDates, todayKey } from "../domain/learning/stats";
import type {
  CardLearningState,
  LearningLevel,
  LearningStats,
  StudyCard,
  StudySessionSummary,
} from "../domain/learning/types";

const secureStorage = createJSONStorage(() => ({
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error("SecureStore getItem error:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error("SecureStore setItem error:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error("SecureStore removeItem error:", error);
    }
  },
}));

type LearningStoreState = {
  /** cardId → learning progress */
  byCardId: Record<string, CardLearningState>;
  sessionLedger: StudySessionSummary[];
  studyDates: string[];
  studyMinutes: number;

  seedDeskCards: (deskId: string, cards: Card[]) => void;
  getLearningState: (cardId: string) => CardLearningState | undefined;
  getStudyCards: (deskId: string, cards: Card[]) => StudyCard[];

  applyCorrect: (cardId: string, now?: number) => CardLearningState | null;
  applyWrong: (cardId: string, now?: number) => CardLearningState | null;
  setLevel: (
    cardId: string,
    level: LearningLevel,
    now?: number
  ) => CardLearningState | null;
  setHard: (cardId: string, isHard: boolean) => CardLearningState | null;

  recordSession: (summary: StudySessionSummary) => void;
  addStudyTime: (durationMs: number) => void;
  markStudied: (date?: Date) => void;
  getStats: (cards: StudyCard[]) => LearningStats;
};

function requireStudyCard(
  byCardId: Record<string, CardLearningState>,
  cardId: string,
  now = Date.now()
): StudyCard | null {
  const raw = byCardId[cardId];
  if (!raw) return null;
  const state = migrateLearningState(raw, now);
  return {
    id: state.cardId,
    deskId: state.deskId,
    word1: "",
    word2: "",
    learningLevel: state.learningLevel,
    correctCount: state.correctCount,
    wrongCount: state.wrongCount,
    isHard: state.isHard,
    lastStudiedAt: state.lastStudiedAt,
    dueAt: state.dueAt,
    intervalDays: state.intervalDays,
  };
}

function migrateMap(
  byCardId: Record<string, CardLearningState>,
  now: number
): { byCardId: Record<string, CardLearningState>; changed: boolean } {
  let changed = false;
  const next: Record<string, CardLearningState> = {};
  for (const [id, value] of Object.entries(byCardId)) {
    const migrated = migrateLearningState(value, now);
    next[id] = migrated;
    if (migrated !== value) changed = true;
  }
  return { byCardId: changed ? next : byCardId, changed };
}

/** Set in `merge`, consumed by rehydrate so the filled dueAt is written back. */
let migratedOnHydrate = false;

export const useLearningStore = create<LearningStoreState>()(
  persist(
    (set, get) => ({
      byCardId: {},
      sessionLedger: [],
      studyDates: [],
      studyMinutes: 0,

      seedDeskCards: (deskId, cards) => {
        set((state) => {
          const now = Date.now();
          const next = { ...state.byCardId };
          let changed = false;
          for (const card of cards) {
            const existing = next[card.id];
            if (!existing) {
              next[card.id] = defaultLearningState(card.id, deskId, now);
              changed = true;
              continue;
            }
            const migrated = migrateLearningState(existing, now);
            if (migrated.deskId !== deskId) {
              next[card.id] = { ...migrated, deskId };
              changed = true;
            } else if (migrated !== existing) {
              next[card.id] = migrated;
              changed = true;
            }
          }
          return changed ? { byCardId: next } : state;
        });
      },

      getLearningState: (cardId) => get().byCardId[cardId],

      getStudyCards: (deskId, cards) => {
        const { byCardId } = get();
        return cards
          .filter((card) => card.deskID === deskId || !deskId)
          .map((card) => mergeCardWithLearning(card, byCardId[card.id]));
      },

      applyCorrect: (cardId, now = Date.now()) => {
        const current = requireStudyCard(get().byCardId, cardId);
        if (!current) return null;
        const updated = domainApplyCorrect(current, now);
        const learning = learningStateFromStudyCard(updated);
        set((state) => ({
          byCardId: { ...state.byCardId, [cardId]: learning },
        }));
        return learning;
      },

      applyWrong: (cardId, now = Date.now()) => {
        const current = requireStudyCard(get().byCardId, cardId);
        if (!current) return null;
        const updated = domainApplyWrong(current, now);
        const learning = learningStateFromStudyCard(updated);
        set((state) => ({
          byCardId: { ...state.byCardId, [cardId]: learning },
        }));
        return learning;
      },

      setLevel: (cardId, level, now = Date.now()) => {
        const current = requireStudyCard(get().byCardId, cardId);
        if (!current) return null;
        const updated = domainSetLevel(current, level, now);
        const learning = learningStateFromStudyCard(updated);
        set((state) => ({
          byCardId: { ...state.byCardId, [cardId]: learning },
        }));
        return learning;
      },

      setHard: (cardId, isHard) => {
        const current = get().byCardId[cardId];
        if (!current) return null;
        const learning = { ...current, isHard };
        set((state) => ({
          byCardId: { ...state.byCardId, [cardId]: learning },
        }));
        return learning;
      },

      recordSession: (summary) => {
        set((state) => ({
          sessionLedger: [...state.sessionLedger, summary],
        }));
      },

      addStudyTime: (durationMs) => {
        const minutes = Math.max(0, Math.round(durationMs / 60000));
        set((state) => ({
          studyMinutes: state.studyMinutes + minutes,
        }));
      },

      markStudied: (date = new Date()) => {
        const key = todayKey(date);
        set((state) =>
          state.studyDates.includes(key)
            ? state
            : { studyDates: [...state.studyDates, key] }
        );
      },

      getStats: (cards) => {
        const state = get();
        return {
          totalCards: cards.length,
          mastered: masteredCount(cards),
          hardCards: cards.filter((card) => card.isHard).length,
          sessions: state.sessionLedger.length,
          streak: streakFromDates(state.studyDates),
          studyMinutes: state.studyMinutes,
        };
      },
    }),
    {
      name: "learning-storage",
      storage: secureStorage,
      merge: (persistedState, currentState) => {
        const saved = (persistedState ?? {}) as Partial<LearningStoreState>;
        const merged = { ...currentState, ...saved };
        if (!saved.byCardId) return merged;
        const { byCardId, changed } = migrateMap(saved.byCardId, Date.now());
        migratedOnHydrate = changed;
        return { ...merged, byCardId };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.log("Error rehydrating learning storage:", error);
          migratedOnHydrate = false;
          return;
        }
        if (!state || !migratedOnHydrate) return;
        migratedOnHydrate = false;
        useLearningStore.setState({ byCardId: state.byCardId });
      },
    }
  )
);
