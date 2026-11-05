import { describe, expect, test } from "bun:test";
import { selectSessionCards } from "../session";
import type { StudySessionConfig } from "../types";
import { makeStudyCard } from "./helpers";

const base: StudySessionConfig = {
  deskId: "d1",
  mode: "normal",
  exercise: "study",
  quizDirection: "w1-w2",
  limit: 20,
  shuffle: false,
  hideMastered: false,
};

describe("session selection", () => {
  test("normal filters by deskId", () => {
    const cards = [
      makeStudyCard({ id: "a", deskId: "d1" }),
      makeStudyCard({ id: "b", deskId: "d2" }),
    ];
    expect(selectSessionCards(cards, base).map((card) => card.id)).toEqual([
      "a",
    ]);
  });

  test("hideMastered removes level-3 cards", () => {
    const cards = [
      makeStudyCard({ id: "a", learningLevel: 3 }),
      makeStudyCard({ id: "b", learningLevel: 2 }),
    ];
    const result = selectSessionCards(cards, {
      ...base,
      hideMastered: true,
    });
    expect(result.map((card) => card.id)).toEqual(["b"]);
  });

  test("wrong mode sorts by wrong count and caps at 50", () => {
    const cards = Array.from({ length: 60 }, (_, index) =>
      makeStudyCard({
        id: `w${index}`,
        wrongCount: index + 1,
        learningLevel: 1,
      })
    );
    const result = selectSessionCards(cards, { ...base, mode: "wrong" });
    expect(result.length).toBe(50);
    expect(result[0].wrongCount).toBeGreaterThanOrEqual(result[1].wrongCount);
  });

  test("forgotten needs mastered plus a wrong answer", () => {
    const cards = [
      makeStudyCard({ id: "a", learningLevel: 3, wrongCount: 1 }),
      makeStudyCard({ id: "b", learningLevel: 3, wrongCount: 0 }),
      makeStudyCard({ id: "c", learningLevel: 2, wrongCount: 2 }),
    ];
    const result = selectSessionCards(cards, { ...base, mode: "forgotten" });
    expect(result.map((card) => card.id)).toEqual(["a"]);
  });

  test("hard mode respects the limit and flag", () => {
    const cards = Array.from({ length: 10 }, (_, index) =>
      makeStudyCard({
        id: `w${index}`,
        isHard: index < 6,
        wrongCount: index,
      })
    );
    const result = selectSessionCards(cards, {
      ...base,
      mode: "hard",
      limit: 3,
    });
    expect(result.length).toBe(3);
    expect(result.every((card) => card.isHard)).toBe(true);
  });

  test("review is random and capped at 50", () => {
    const cards = Array.from({ length: 70 }, (_, index) =>
      makeStudyCard({ id: `w${index}` })
    );
    const result = selectSessionCards(
      cards,
      { ...base, mode: "review" },
      () => 0.5
    );
    expect(result.length).toBe(50);
  });
});
