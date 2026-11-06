import { startOfLocalDay } from "./level";
import type { LearningLevel, StudyCard, StudySessionConfig } from "./types";

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
 * Wrong answer that leaves the card at level 0: append it once to the end
 * of this session. A second miss in the same session is not appended.
 * `upcoming` is next-to-last order (index 0 is the next card).
 */
export function queueLevelZeroRetry<T>(
  upcoming: readonly T[],
  card: T,
  levelAfterWrong: LearningLevel,
  alreadyRetriedIds: ReadonlySet<string>,
  idOf: (item: T) => string
): T[] {
  if (levelAfterWrong !== 0 || alreadyRetriedIds.has(idOf(card))) {
    return [...upcoming];
  }
  return [...upcoming, card];
}

/**
 * Flip draws the last stack item next. A level-0 miss goes to the bottom
 * so it is shown once after the cards that are still waiting.
 */
export function withFlipLevelZeroRetry(
  stack: readonly StudyCard[],
  levelAfterWrong: LearningLevel,
  alreadyRetriedIds: ReadonlySet<string>
): { stack: StudyCard[]; appended: boolean } {
  if (stack.length === 0) return { stack: [], appended: false };
  const card = stack[stack.length - 1];
  const rest = stack.slice(0, -1);
  const upcoming = [...rest].reverse();
  const queued = queueLevelZeroRetry(
    upcoming,
    card,
    levelAfterWrong,
    alreadyRetriedIds,
    (item) => item.id
  );
  if (queued.length === upcoming.length) {
    return { stack: [...rest], appended: false };
  }
  return { stack: [...queued].reverse(), appended: true };
}

/**
 * Due cards, oldest day first. Within one calendar day, shuffle when asked.
 * Cards that share a day stay together so an overdue day is never mixed
 * behind a later day.
 */
export function orderDueCards(
  due: StudyCard[],
  shuffleWithinDay: boolean,
  rng: () => number = Math.random
): StudyCard[] {
  if (!shuffleWithinDay) {
    return [...due].sort(
      (a, b) => a.dueAt - b.dueAt || a.id.localeCompare(b.id)
    );
  }

  const groups = new Map<number, StudyCard[]>();
  for (const card of due) {
    const day = startOfLocalDay(card.dueAt);
    const bucket = groups.get(day);
    if (bucket) bucket.push(card);
    else groups.set(day, [card]);
  }

  const ordered: StudyCard[] = [];
  for (const day of [...groups.keys()].sort((a, b) => a - b)) {
    ordered.push(...shuffleCopy(groups.get(day) ?? [], rng));
  }
  return ordered;
}

/**
 * Select cards for a study session.
 * Phase 1: one desk = one pool (VB unitId filter → deskId).
 * `today` is the calendar queue. Wrong / hard / review do not replace it.
 */
export function selectSessionCards(
  allCards: StudyCard[],
  config: StudySessionConfig,
  rng: () => number = Math.random,
  now: number = Date.now()
): StudyCard[] {
  let cards: StudyCard[];

  switch (config.mode) {
    case "today":
      cards = orderDueCards(
        allCards.filter(
          (card) => card.deskId === config.deskId && card.dueAt <= now
        ),
        config.shuffle,
        rng
      );
      break;
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

  // Bugün must still show a level-3 card whose gap has elapsed.
  if (config.hideMastered && config.mode !== "today") {
    cards = cards.filter((card) => card.learningLevel !== 3);
  }

  // Today already shuffled inside each day. A full shuffle would bury overdue cards.
  if (config.shuffle && config.mode !== "today") {
    cards = shuffleCopy(cards, rng);
  }

  return cards;
}

export function countByMode(
  allCards: StudyCard[],
  config: Omit<StudySessionConfig, "mode">,
  now: number = Date.now()
): Record<string, number> {
  const modes = ["today", "normal", "wrong", "hard", "review"] as const;
  return Object.fromEntries(
    modes.map((mode) => [
      mode,
      selectSessionCards(allCards, { ...config, mode }, Math.random, now)
        .length,
    ])
  );
}
