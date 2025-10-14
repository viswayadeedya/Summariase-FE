// src/store/useTokenStore.ts
import { create } from "zustand";

type TokenStore = {
  hasToken: boolean;
  setHasToken: (val: boolean) => void;
};

export const useTokenStore = create<TokenStore>((set) => ({
  hasToken: false,
  setHasToken: (val) => set({ hasToken: val }),
}));
