import { beforeEach, describe, expect, test } from "bun:test";
import type { Card } from "../../../types/cardAndDesk";
import { selectSessionCards } from "../session";
import { applyCorrect } from "../level";
import {
  defaultLearningState,
  learningStateFromStudyCard,
  mergeCardWithLearning,
} from "../merge";
import type { StudySessionConfig } from "../types";

/**
 * Store-free integration of the Phase 1 pipeline:
 * seed defaults → merge → selectSession → rate → persist-shaped state.
 * (Full Zustand/SecureStore needs RN; domain path is what Phase 1 accepts.)
 */
describe("study session pipeline", () => {
  const deskId = "desk-1";
  let byCardId: Record<string, ReturnType<typeof defaultLearningState>>;
  let cards: Card[];

  beforeEach(() => {
    cards = [
      {
        id: "c1",
        deskID: deskId,
        word1: "apple",
        word2: "elma",
        importanceLevel: "medium",
      },
      {
        id: "c2",
        deskID: deskId,
        word1: "book",
        word2: "kitap",
        importanceLevel: "low",
      },
      {
        id: "c3",
        deskID: deskId,
        word1: "water",
        word2: "su",
        importanceLevel: "high",
      },
    ];
    byCardId = {};
    for (const card of cards) {
      byCardId[card.id] = defaultLearningState(card.id, deskId);
    }
  });

  test("programmatic session list for a desk", () => {
    const pool = cards.map((card) =>
      mergeCardWithLearning(card, byCardId[card.id])
    );
    const config: StudySessionConfig = {
      deskId,
      mode: "normal",
      exercise: "quiz",
      quizDirection: "w1-w2",
      limit: 20,
      shuffle: false,
      hideMastered: false,
    };
    const session = selectSessionCards(pool, config);
    expect(session.map((c) => c.id).sort()).toEqual(["c1", "c2", "c3"]);
  });

  test("rating updates learning state shaped for SecureStore map", () => {
    let study = mergeCardWithLearning(cards[0], byCardId.c1);
    study = applyCorrect(study, 10);
    study = applyCorrect(study, 11);
    study = applyCorrect(study, 12);
    byCardId.c1 = learningStateFromStudyCard(study);

    expect(byCardId.c1.learningLevel).toBe(3);
    expect(byCardId.c1.correctCount).toBe(3);
    expect(byCardId.c1.lastStudiedAt).toBe(12);
  });
});
