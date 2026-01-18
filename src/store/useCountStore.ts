import { create } from "zustand";
import type { CountState, CountModel } from "../types/count";
import api from "../api";

const ENDPOINT = "statistics/count";

export const useCountStore = create<CountState>((set, get) => ({
  status: false,
  message: "",
  data: {
    categories: 0,
    products: 0,
    stores: 0,
    users: 0,
  },
  selected: {
    categories: 0,
    products: 0,
    stores: 0,
    users: 0,
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchCounts: async () => {
    set({ loading: true });
    try {
      const res = await api.get(ENDPOINT);

      set({
        data: res.data.data as CountModel,
        status: get().status,
        message: get().message,
      });
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedCount: (count: CountModel) => set({ selected: count }),
}));
