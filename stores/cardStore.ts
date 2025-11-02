import { create } from "zustand";
import { Card } from "../types/cardAndDesk";
import { deleteCard } from "../services/cardService";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

// Secure storage adapter for zustand persist
const secureStorage = createJSONStorage(() => ({
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error("SecureStore getItem error:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error("SecureStore setItem error:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error("SecureStore removeItem error:", error);
    }
  },
}));

type CardState = {
  cards: Record<string, Card[]>;
  setCards: (deckId: string, cards: Card[]) => void;
  getCards: (deckId: string) => Card[];

  deleteCard: (cardId: string, deskId: string) => Promise<void>;
};

export const useCardStore = create<CardState>()(
  persist(
    (set, get) => ({
      cards: {},

      setCards: (deckId: string, cards: Card[]) => {
        try {
          set((state) => ({
            cards: {
              ...state.cards,
              [deckId]: cards,
            },
          }));
        } catch (error) {
          console.log("Error setting cards:", error);
        }
      },

      getCards: (deckId: string) => {
        try {
          const state = get();
          return state.cards[deckId] || [];
        } catch (error) {
          console.log("Error getting cards:", error);
          return [];
        }
      },

      deleteCard: async (cardId: string, deskId: string) => {
        try {
          await deleteCard(cardId, deskId);

          // Store'dan kartı sil
          set((state) => ({
            cards: {
              ...state.cards,
              [deskId]:
                state.cards[deskId]?.filter((card) => card.id !== cardId) || [],
            },
          }));
        } catch (error) {
          console.error("Error deleting card:", error);
          throw error;
        }
      },
    }),
    {
      name: "card-storage",
      storage: secureStorage,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.log("Error rehydrating card storage:", error);
        } else {
          console.log("Card storage rehydrated successfully");
        }
      },
    }
  )
);
