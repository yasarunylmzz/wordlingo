/**
 * Design tokens mirrored from the Wordlingo Tailwind UI prototype.
 * Keep pixel values aligned with docs/ui-prototype-src.
 */

export const colors = {
  paper: "#f5f5f8",
  ink: "#16151d",
  inkSoft: "#2c2a36",
  muted: "#6f6d7b",
  line: "#e6e5ec",
  bar: "#dedbee",
  accent: "#4f40d8",
  accentDeep: "#3e30c2",
  accentSoft: "#ecebfc",
  white: "#ffffff",
  correct: "#13865d",
  wrong: "#d9492f",
  correctBg: "#e2f4ec",
  wrongBg: "#fdebe6",
  correctBgHover: "#d5efe3",
  wrongBgHover: "#fbdfd7",
  flame: "#ffc36b",
  priorityHigh: "#f0603f",
  priorityMid: "#f5a524",
  segmentTrack: "#e9e8f0",
  inkOverlay: "rgba(22, 21, 29, 0.35)",
  barHover: "#c9c4e6",
  accentSoftHover: "#e1defa",
  level1: "#c9c3f5",
  level2: "#8f84ea",
} as const;

export const radii = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 22,
  "3xl": 28,
  full: 9999,
} as const;

export const space = {
  px: 1,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
} as const;

export const fonts = {
  regular: "Geist_400Regular",
  medium: "Geist_500Medium",
  semibold: "Geist_600SemiBold",
  bold: "Geist_700Bold",
  mono: "GeistMono_400Regular",
  monoMedium: "GeistMono_500Medium",
} as const;

export const typography = {
  hero: {
    fontFamily: fonts.semibold,
    fontSize: 30,
    lineHeight: 31.5,
    letterSpacing: -1.05,
    color: colors.ink,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    letterSpacing: -0.55,
    color: colors.ink,
  },
  section: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  monoLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: "uppercase" as const,
    color: colors.muted,
  },
  tab: {
    fontFamily: fonts.medium,
    fontSize: 10.5,
  },
} as const;

/** Deck avatar tone palette from prototype data/decks.ts */
export const deckTones = [
  { bg: "#ecebfc", fg: "#4f40d8", dot: "#4f40d8" },
  { bg: "#e4edfd", fg: "#2f68d6", dot: "#2f68d6" },
  { bg: "#e0f1f7", fg: "#1a82a3", dot: "#1a82a3" },
  { bg: "#dff3ea", fg: "#16845e", dot: "#16845e" },
  { bg: "#fcece2", fg: "#c25a1a", dot: "#c25a1a" },
] as const;

export const levelMeta = [
  { label: "Yeni", color: colors.bar },
  { label: "Başlangıç", color: colors.level1 },
  { label: "İyi", color: colors.level2 },
  { label: "Öğrenildi", color: colors.accent },
] as const;

export function deckInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function greetingForHour(hour: number): string {
  if (hour < 6) return "İyi geceler";
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "İyi günler";
  return "İyi akşamlar";
}
