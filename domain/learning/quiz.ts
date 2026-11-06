import { shuffleCopy } from "./session";
import type { QuizDirection, StudyCard } from "./types";

/** Each quiz question shows the correct answer plus 3 distractors. */
export const QUIZ_MIN_CARDS = 4;

export interface QuizQuestion {
  cardId: string;
  prompt: string;
  answer: string;
  options: string[];
  correctIndex: number;
}

const norm = (s: string) => s.trim().toLocaleLowerCase("tr-TR");

export function answerOf(card: StudyCard, direction: QuizDirection): string {
  return direction === "w1-w2" ? card.word2 : card.word1;
}

export function questionOf(card: StudyCard, direction: QuizDirection): string {
  return direction === "w1-w2" ? card.word1 : card.word2;
}

/** Unique answer strings from the deck (trimmed, Turkish-lowercase unique). */
export function uniqueAnswers(
  cards: StudyCard[],
  direction: QuizDirection,
): string[] {
  const seen = new Map<string, string>();
  for (const c of cards) {
    const a = answerOf(c, direction);
    if (!a?.trim()) continue;
    if (!seen.has(norm(a))) seen.set(norm(a), a);
  }
  return [...seen.values()];
}

export function buildQuizQuestions(
  cards: StudyCard[],
  pool: StudyCard[],
  direction: QuizDirection,
  rng: () => number = Math.random,
): QuizQuestion[] {
  const answers = uniqueAnswers(pool, direction);
  const questions: QuizQuestion[] = [];

  for (const card of cards) {
    const prompt = questionOf(card, direction);
    const answer = answerOf(card, direction);
    const distractors = shuffleCopy(
      answers.filter((a) => norm(a) !== norm(answer)),
      rng,
    ).slice(0, 3);

    if (distractors.length < 3) continue;

    const all = shuffleCopy([answer, ...distractors], rng);
    questions.push({
      cardId: card.id,
      prompt,
      answer,
      options: all,
      correctIndex: all.findIndex((o) => norm(o) === norm(answer)),
    });
  }

  return questions;
}
