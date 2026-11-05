import type { StudyCard } from "./types";

export function masteredCount(cards: StudyCard[]): number {
  return cards.filter((card) => card.learningLevel === 3).length;
}

export function deskPercent(cards: StudyCard[]): number {
  if (cards.length === 0) return 0;
  return Math.round((masteredCount(cards) / cards.length) * 100);
}

export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function keyForOffset(offset: number, date = new Date()): string {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + offset);
  return todayKey(copy);
}

export function streakFromDates(dates: string[], today = new Date()): number {
  const unique = new Set(dates);
  let streak = 0;
  let offset = unique.has(todayKey(today)) ? 0 : -1;

  while (unique.has(keyForOffset(offset, today))) {
    streak += 1;
    offset -= 1;
  }

  return streak;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} sa` : `${hours} sa ${rest} dk`;
}
