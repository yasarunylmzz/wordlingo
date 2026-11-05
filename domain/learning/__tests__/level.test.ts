import { describe, expect, test } from "bun:test";
import { applyCorrect, applyWrong, decreaseLevel, toLevel } from "../level";
import { makeStudyCard } from "./helpers";

describe("level ladder", () => {
  test("decreaseLevel follows the original map", () => {
    expect(decreaseLevel(0)).toBe(0);
    expect(decreaseLevel(1)).toBe(0);
    expect(decreaseLevel(2)).toBe(1);
    expect(decreaseLevel(3)).toBe(2);
  });

  test("toLevel clamps bad input", () => {
    expect(toLevel(0)).toBe(0);
    expect(toLevel(1)).toBe(1);
    expect(toLevel(2)).toBe(2);
    expect(toLevel(3)).toBe(3);
    expect(toLevel(99)).toBe(3);
    expect(toLevel(-1)).toBe(0);
  });

  test("three clean correct answers promote to mastered (3)", () => {
    let card = makeStudyCard();
    card = applyCorrect(card, 1);
    card = applyCorrect(card, 2);
    expect(card.learningLevel).toBe(0);
    card = applyCorrect(card, 3);
    expect(card.learningLevel).toBe(3);
    expect(card.correctCount).toBe(3);
  });

  test("a card with a wrong answer never auto-promotes", () => {
    let card = makeStudyCard({ wrongCount: 1 });
    card = applyCorrect(card, 1);
    card = applyCorrect(card, 2);
    card = applyCorrect(card, 3);
    expect(card.learningLevel).toBe(0);
  });

  test("wrong answer demotes and increments", () => {
    const card = applyWrong(
      makeStudyCard({ learningLevel: 2, wrongCount: 1 }),
      5
    );
    expect(card.learningLevel).toBe(1);
    expect(card.wrongCount).toBe(2);
    expect(card.lastStudiedAt).toBe(5);
  });
});
