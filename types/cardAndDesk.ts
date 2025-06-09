export interface Card {
  id: string;
  word1: string;
  word2: string;
  importanceLevel: "low" | "medium" | "high";
}

export interface Desk {
  id: string;
  title: string;
  description: string;
}
