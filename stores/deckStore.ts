import { create } from "zustand";

type DeskState = {
  desk: Partial<Desk>;
  setDesk: (
    desk: Pick<Desk, "title" | "description" | "userId" | "imageUrl">
  ) => void;
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
