interface Card {
  id: string;
  word1: string;
  word2: string;
  importanceLevel: "low" | "medium" | "high";
}

interface Desk {
  id: string;
  title: string;
  description: string;
  userId: string;
  imageUrl: string | null;
}
