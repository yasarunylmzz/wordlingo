import type { StudyCard, StudySessionConfig } from "./types";

export function shuffleCopy<T>(
  items: T[],
  rng: () => number = Math.random
): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Select cards for a study session.
 * Phase 1: one desk = one pool (VB unitId filter → deskId).
 */
export function selectSessionCards(
  allCards: StudyCard[],
  config: StudySessionConfig,
  rng: () => number = Math.random
): StudyCard[] {
  let cards: StudyCard[];

  switch (config.mode) {
    case "normal":
      cards = allCards.filter((card) => card.deskId === config.deskId);
      break;
    case "wrong":
      cards = allCards
        .filter((card) => card.wrongCount > 0)
        .sort(
          (a, b) =>
            b.wrongCount - a.wrongCount || b.lastStudiedAt - a.lastStudiedAt
        )
        .slice(0, 50);
      break;
    case "forgotten":
      cards = allCards
        .filter((card) => card.learningLevel === 3 && card.wrongCount > 0)
        .sort((a, b) => b.lastStudiedAt - a.lastStudiedAt)
        .slice(0, 50);
      break;
    case "hard":
      cards = allCards
        .filter((card) => card.isHard)
        .sort(
          (a, b) =>
            b.wrongCount - a.wrongCount || b.lastStudiedAt - a.lastStudiedAt
        )
        .slice(0, config.limit);
      break;
    case "review":
      cards = shuffleCopy(allCards, rng).slice(0, 50);
      break;
    default:
      cards = [];
  }

  if (config.hideMastered) {
    cards = cards.filter((card) => card.learningLevel !== 3);
  }

  if (config.shuffle) {
    cards = shuffleCopy(cards, rng);
  }

  return cards;
}

export function countByMode(
  allCards: StudyCard[],
  config: Omit<StudySessionConfig, "mode">
): Record<string, number> {
  const modes = [
    "normal",
    "wrong",
    "forgotten",
    "hard",
    "review",
  ] as const;
  return Object.fromEntries(
    modes.map((mode) => [
      mode,
      selectSessionCards(allCards, { ...config, mode }).length,
    ])
  );
}
