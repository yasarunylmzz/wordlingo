import { create } from "zustand";

type RouteState = {
  route: string;
  setRoute: (route: string) => void;
  resetRoute: () => void;
};

export const useRoute = create<RouteState>((set) => ({
  route: "Home",
  setRoute: (route) => set({ route }),
  resetRoute: () => set({ route: "Home" }),
}));
