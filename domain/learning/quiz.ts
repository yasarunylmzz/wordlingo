import { shuffleCopy } from "./session";
import type { QuizDirection, StudyCard } from "./types";

export interface QuizQuestion {
  cardId: string;
  prompt: string;
  answer: string;
  options: string[];
  correctIndex: number;
}

export function buildQuizQuestions(
  cards: StudyCard[],
  pool: StudyCard[],
  direction: QuizDirection,
  rng: () => number = Math.random
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const card of cards) {
    const prompt = direction === "w1-w2" ? card.word1 : card.word2;
    const answer = direction === "w1-w2" ? card.word2 : card.word1;

    const candidates = shuffleCopy(
      pool.filter((item) => item.id !== card.id),
      rng
    );

    const options: string[] = [];
    for (const candidate of candidates) {
      const value =
        direction === "w1-w2" ? candidate.word2 : candidate.word1;
      if (!value || value === answer) continue;
      if (
        options.some((option) => option.toLowerCase() === value.toLowerCase())
      ) {
        continue;
      }
      options.push(value);
      if (options.length === 3) break;
    }

    if (options.length < 3) continue;

    const all = shuffleCopy([...options, answer], rng);
    questions.push({
      cardId: card.id,
      prompt,
      answer,
      options: all,
      correctIndex: all.indexOf(answer),
    });
  }

  return questions;
}
