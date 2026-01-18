import { create } from "zustand";
import type { StatisticState, StatisticModel } from "../types/statistic";
import api from "../api";

const ENDPOINT = "statistics/orders-chart";

export const useStatisticStore = create<StatisticState>((set, get) => ({
  status: false,
  message: "",
  data: [],
  selected: {
    year: new Date().getFullYear(),
    data: []
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchStatistics: async (year: number) => {
    set({ loading: true });
    try {
      const res = await api.get(ENDPOINT, { params: { year } });
      console.log("res: ", res)
      set({
        data: res.data.data.data as StatisticModel[],
        status: get().status,
        message: get().message,
      });
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedStatistic: (statistic: StatisticModel) => set({ selected: statistic }),
}));
