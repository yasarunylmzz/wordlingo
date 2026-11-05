import { describe, expect, test } from "bun:test";
import { buildQuizQuestions } from "../quiz";
import { makeStudyCard } from "./helpers";

const pool = [
  makeStudyCard({ id: "w1", word1: "decide", word2: "karar vermek" }),
  makeStudyCard({ id: "w2", word1: "improve", word2: "geliştirmek" }),
  makeStudyCard({ id: "w3", word1: "manage", word2: "yönetmek" }),
  makeStudyCard({ id: "w4", word1: "prepare", word2: "hazırlamak" }),
  makeStudyCard({ id: "w5", word1: "protect", word2: "korumak" }),
  makeStudyCard({ id: "w6", word1: "travel", word2: "seyahat etmek" }),
];

describe("quiz generation", () => {
  test("builds four shuffled options with the correct answer", () => {
    const [question] = buildQuizQuestions([pool[0]], pool, "w1-w2", () => 0.3);
    expect(question.options.length).toBe(4);
    expect(question.options).toContain("karar vermek");
    expect(question.options[question.correctIndex]).toBe("karar vermek");
    expect(new Set(question.options).size).toBe(4);
  });

  test("supports reverse direction", () => {
    const [question] = buildQuizQuestions([pool[1]], pool, "w2-w1", () => 0.7);
    expect(question.prompt).toBe("geliştirmek");
    expect(question.answer).toBe("improve");
  });

  test("drops cards when fewer than three distractors exist", () => {
    const tiny = pool.slice(0, 3);
    expect(buildQuizQuestions([tiny[0]], tiny, "w1-w2")).toEqual([]);
  });
});
