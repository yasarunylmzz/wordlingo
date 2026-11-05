import type { StudyCard } from "../types";

export function makeStudyCard(
  overrides: Partial<StudyCard> = {}
): StudyCard {
  return {
    id: "c1",
    deskId: "d1",
    word1: "decide",
    word2: "karar vermek",
    learningLevel: 0,
    correctCount: 0,
    wrongCount: 0,
    isHard: false,
    lastStudiedAt: 0,
    ...overrides,
  };
}
