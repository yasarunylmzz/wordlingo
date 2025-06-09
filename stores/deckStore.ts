import { create } from "zustand";
import { Desk } from "../types/cardAndDesk";

type DeskState = {
  desk: Partial<Desk>;
  setDesk: (desk: Pick<Desk, "title" | "description" | "id">) => void;
  deleteDesk: () => void;
  editDesk: (updatedDesk: Partial<Desk>) => void;
};

export const useDeskStore = create<DeskState>((set) => ({
  desk: {},
  setDesk: (desk) => set((state) => ({ desk: { ...state.desk, ...desk } })),
  deleteDesk: () => set({ desk: {} }),
  editDesk: (updatedDesk) =>
    set((state) => ({
      desk: { ...state.desk, ...updatedDesk },
    })),
}));
