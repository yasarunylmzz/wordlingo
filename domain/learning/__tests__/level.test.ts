import { describe, expect, test } from "bun:test";
import {
  applyCorrect,
  applyWrong,
  BASE_INTERVAL_DAYS,
  decreaseLevel,
  MAX_INTERVAL_DAYS,
  MS_PER_DAY,
  setLevel,
  toLevel,
} from "../level";
import { makeStudyCard } from "./helpers";

describe("level ladder", () => {
  test("decreaseLevel drops one step and stays at 0", () => {
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

  test("each correct answer climbs one step", () => {
    let card = makeStudyCard();
    card = applyCorrect(card, 1);
    expect(card.learningLevel).toBe(1);
    expect(card.intervalDays).toBe(BASE_INTERVAL_DAYS[1]);
    expect(card.dueAt).toBe(1 + MS_PER_DAY);

    card = applyCorrect(card, 2);
    expect(card.learningLevel).toBe(2);
    expect(card.intervalDays).toBe(BASE_INTERVAL_DAYS[2]);
    expect(card.dueAt).toBe(2 + 4 * MS_PER_DAY);

    card = applyCorrect(card, 3);
    expect(card.learningLevel).toBe(3);
    expect(card.correctCount).toBe(3);
    expect(card.intervalDays).toBe(BASE_INTERVAL_DAYS[3]);
    expect(card.dueAt).toBe(3 + 14 * MS_PER_DAY);
  });

  test("a prior wrong answer does not block the one-step climb", () => {
    const card = applyCorrect(
      makeStudyCard({ learningLevel: 1, wrongCount: 4, intervalDays: 1 }),
      50
    );
    expect(card.learningLevel).toBe(2);
    expect(card.intervalDays).toBe(4);
    expect(card.dueAt).toBe(50 + 4 * MS_PER_DAY);
  });

  test("three clean corrects no longer jump straight to 3", () => {
    let card = makeStudyCard({ correctCount: 5, wrongCount: 0 });
    card = applyCorrect(card, 9);
    expect(card.learningLevel).toBe(1);
  });

  test("wrong answer demotes one step onto that step's base interval", () => {
    const card = applyWrong(
      makeStudyCard({ learningLevel: 2, wrongCount: 1, intervalDays: 4 }),
      5
    );
    expect(card.learningLevel).toBe(1);
    expect(card.wrongCount).toBe(2);
    expect(card.lastStudiedAt).toBe(5);
    expect(card.intervalDays).toBe(1);
    expect(card.dueAt).toBe(5 + MS_PER_DAY);
  });

  test("a level-3 doubled gap is not carried down on a wrong answer", () => {
    const card = applyWrong(
      makeStudyCard({ learningLevel: 3, intervalDays: 56, dueAt: 999 }),
      80
    );
    expect(card.learningLevel).toBe(2);
    expect(card.intervalDays).toBe(BASE_INTERVAL_DAYS[2]);
    expect(card.dueAt).toBe(80 + 4 * MS_PER_DAY);
  });

  test("level 0 stays due the same day", () => {
    const dropped = applyWrong(
      makeStudyCard({ learningLevel: 1, intervalDays: 1 }),
      20
    );
    expect(dropped.learningLevel).toBe(0);
    expect(dropped.intervalDays).toBe(0);
    expect(dropped.dueAt).toBe(20);

    const stillNew = applyWrong(makeStudyCard({ learningLevel: 0 }), 21);
    expect(stillNew.learningLevel).toBe(0);
    expect(stillNew.intervalDays).toBe(0);
    expect(stillNew.dueAt).toBe(21);
  });

  test("level 3 doubles 14, 28, 56, then caps at 90", () => {
    let card = makeStudyCard({ learningLevel: 3, intervalDays: 14 });
    card = applyCorrect(card, 100);
    expect(card.learningLevel).toBe(3);
    expect(card.intervalDays).toBe(28);
    expect(card.dueAt).toBe(100 + 28 * MS_PER_DAY);

    card = applyCorrect(card, 200);
    expect(card.intervalDays).toBe(56);
    expect(card.dueAt).toBe(200 + 56 * MS_PER_DAY);

    card = applyCorrect(card, 300);
    expect(card.intervalDays).toBe(MAX_INTERVAL_DAYS);
    expect(card.dueAt).toBe(300 + 90 * MS_PER_DAY);

    card = applyCorrect(card, 400);
    expect(card.intervalDays).toBe(90);
    expect(card.dueAt).toBe(400 + 90 * MS_PER_DAY);
  });

  test("a level-3 card with no interval yet starts at 14, not 28", () => {
    const card = applyCorrect(
      makeStudyCard({ learningLevel: 3, intervalDays: 0 }),
      7
    );
    expect(card.intervalDays).toBe(14);
    expect(card.dueAt).toBe(7 + 14 * MS_PER_DAY);
  });

  test("setLevel writes the base interval of the chosen step", () => {
    const card = setLevel(
      makeStudyCard({ learningLevel: 3, intervalDays: 56 }),
      1,
      11
    );
    expect(card.learningLevel).toBe(1);
    expect(card.intervalDays).toBe(1);
    expect(card.dueAt).toBe(11 + MS_PER_DAY);
  });
});
