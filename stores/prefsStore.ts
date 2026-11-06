import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

const secureStorage = createJSONStorage(() => ({
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      /* ignore */
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      /* ignore */
    }
  },
}));

export type Priority = "yüksek" | "orta" | "düşük";

export type TodoItem = {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
};

type PrefsState = {
  goalMinutes: number;
  notifications: boolean;
  /** First-launch onboarding completed (steps → welcome). */
  onboardingSeen: boolean;
  deckTones: Record<string, number>;
  recentSearches: string[];
  todos: TodoItem[];
  setGoalMinutes: (n: number) => void;
  setNotifications: (v: boolean) => void;
  setOnboardingSeen: (v: boolean) => void;
  setDeckTone: (deckId: string, tone: number) => void;
  getDeckTone: (deckId: string, fallbackIndex?: number) => number;
  addRecentSearch: (word: string) => void;
  clearRecentSearches: () => void;
  setTodos: (todos: TodoItem[]) => void;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
};

const defaultTodos: TodoItem[] = [
  {
    id: "1",
    title: "React Native projesini bitir",
    done: false,
    priority: "yüksek",
  },
  { id: "2", title: "Sınavlara çalış", done: false, priority: "orta" },
  { id: "3", title: "Yeni bir kitap oku", done: true, priority: "düşük" },
];

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      goalMinutes: 20,
      notifications: true,
      onboardingSeen: false,
      deckTones: {},
      recentSearches: [],
      todos: defaultTodos,
      setGoalMinutes: (goalMinutes) => set({ goalMinutes }),
      setNotifications: (notifications) => set({ notifications }),
      setOnboardingSeen: (onboardingSeen) => set({ onboardingSeen }),
      setDeckTone: (deckId, tone) =>
        set((s) => ({
          deckTones: { ...s.deckTones, [deckId]: tone },
        })),
      getDeckTone: (deckId, fallbackIndex = 0) =>
        get().deckTones[deckId] ?? fallbackIndex % 5,
      addRecentSearch: (word) => {
        const w = word.trim().toLowerCase();
        if (!w) return;
        set((s) => ({
          recentSearches: [w, ...s.recentSearches.filter((x) => x !== w)].slice(
            0,
            6,
          ),
        }));
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
      setTodos: (todos) => set({ todos }),
      addTodo: (title) => {
        const t = title.trim();
        if (!t) return;
        set((s) => ({
          todos: [
            ...s.todos,
            {
              id: String(Date.now()),
              title: t,
              done: false,
              priority: "orta" as Priority,
            },
          ],
        }));
      },
      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t,
          ),
        })),
      removeTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
    }),
    {
      name: "prefs-storage",
      storage: secureStorage,
      partialize: (s) => ({
        goalMinutes: s.goalMinutes,
        notifications: s.notifications,
        onboardingSeen: s.onboardingSeen,
        deckTones: s.deckTones,
        recentSearches: s.recentSearches,
        todos: s.todos,
      }),
    },
  ),
);
