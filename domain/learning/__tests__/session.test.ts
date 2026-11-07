import { describe, expect, test } from "bun:test";
import { applyWrong } from "../level";
import {
  queueLevelZeroRetry,
  selectSessionCards,
  withFlipLevelZeroRetry,
} from "../session";
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

const now = new Date(2026, 5, 15, 15, 0, 0).getTime();
const twoDaysAgo = new Date(2026, 5, 13, 9, 0, 0).getTime();
const yesterday = new Date(2026, 5, 14, 11, 0, 0).getTime();
const earlierToday = new Date(2026, 5, 15, 8, 0, 0).getTime();
const alsoToday = new Date(2026, 5, 15, 10, 0, 0).getTime();
const laterToday = new Date(2026, 5, 15, 18, 0, 0).getTime();

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

  test("today keeps due and overdue cards, oldest day first", () => {
    const cards = [
      makeStudyCard({ id: "future", dueAt: laterToday }),
      makeStudyCard({ id: "today-a", dueAt: earlierToday }),
      makeStudyCard({ id: "today-b", dueAt: alsoToday }),
      makeStudyCard({ id: "yesterday", dueAt: yesterday }),
      makeStudyCard({ id: "older", dueAt: twoDaysAgo }),
      makeStudyCard({ id: "other-desk", deskId: "d2", dueAt: twoDaysAgo }),
    ];
    const result = selectSessionCards(
      cards,
      { ...base, mode: "today", shuffle: false },
      () => 0,
      now
    );
    expect(result.map((card) => card.id)).toEqual([
      "older",
      "yesterday",
      "today-a",
      "today-b",
    ]);
  });

  test("today shuffles inside a day and still keeps overdue days ahead", () => {
    const cards = [
      makeStudyCard({ id: "today-a", dueAt: earlierToday }),
      makeStudyCard({ id: "today-b", dueAt: alsoToday }),
      makeStudyCard({ id: "older", dueAt: twoDaysAgo }),
    ];
    const result = selectSessionCards(
      cards,
      { ...base, mode: "today", shuffle: true },
      () => 0,
      now
    );
    expect(result.map((card) => card.id)).toEqual([
      "older",
      "today-b",
      "today-a",
    ]);
  });

  test("today still includes a due level-3 card when hideMastered is on", () => {
    const cards = [
      makeStudyCard({
        id: "learned",
        learningLevel: 3,
        intervalDays: 14,
        dueAt: yesterday,
      }),
      makeStudyCard({ id: "waiting", learningLevel: 3, dueAt: laterToday }),
    ];
    const result = selectSessionCards(
      cards,
      { ...base, mode: "today", hideMastered: true },
      () => 0,
      now
    );
    expect(result.map((card) => card.id)).toEqual(["learned"]);
  });

  test("a level-0 card that is still new the next day stays due", () => {
    const reviewed = applyWrong(
      makeStudyCard({ id: "fresh", learningLevel: 0 }),
      yesterday
    );
    const result = selectSessionCards(
      [reviewed],
      { ...base, mode: "today", shuffle: false },
      () => 0,
      now
    );
    expect(reviewed.dueAt).toBe(yesterday);
    expect(result.map((card) => card.id)).toEqual(["fresh"]);
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

  test("a level-0 miss is appended once at the end of the session", () => {
    const retried = new Set<string>();
    const idOf = (card: { id: string }) => card.id;
    const first = queueLevelZeroRetry(
      [{ id: "b" }, { id: "c" }],
      { id: "a" },
      0,
      retried,
      idOf
    );
    expect(first.map((card) => card.id)).toEqual(["b", "c", "a"]);
    retried.add("a");

    const second = queueLevelZeroRetry(first, { id: "a" }, 0, retried, idOf);
    expect(second.map((card) => card.id)).toEqual(["b", "c", "a"]);

    const notZero = queueLevelZeroRetry(
      [{ id: "b" }],
      { id: "d" },
      1,
      retried,
      idOf
    );
    expect(notZero.map((card) => card.id)).toEqual(["b"]);
  });

  test("flip shows a level-0 miss once after the remaining cards", () => {
    const stack = [
      makeStudyCard({ id: "a" }),
      makeStudyCard({ id: "b" }),
      makeStudyCard({ id: "c" }),
    ];
    const retried = new Set<string>();
    const first = withFlipLevelZeroRetry(stack, 0, retried);
    expect(first.appended).toBe(true);
    expect(first.stack.map((card) => card.id)).toEqual(["c", "a", "b"]);
    retried.add("c");

    const again = withFlipLevelZeroRetry(
      [makeStudyCard({ id: "c" })],
      0,
      retried
    );
    expect(again.appended).toBe(false);
    expect(again.stack).toEqual([]);

    const droppedToOne = withFlipLevelZeroRetry(stack, 1, new Set());
    expect(droppedToOne.appended).toBe(false);
    expect(droppedToOne.stack.map((card) => card.id)).toEqual(["a", "b"]);
  });
});
