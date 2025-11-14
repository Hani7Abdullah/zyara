import { create } from "zustand";
import type { StatisticState, StatisticModel } from "../types/statistic";
import api from "../api";

const ENDPOINT = "statistics";

export const useStatisticStore = create<StatisticState>((set, get) => ({
  status: false,
  message: "",
  data: [
    // { name: 'Jan', orders: 520 },
    // { name: 'Feb', orders: 450 },
    // { name: 'Mar', orders: 610 },
    // { name: 'Apr', orders: 490 },
    // { name: 'May', orders: 700 },
    // { name: 'Jun', orders: 640 },
    // { name: 'Jul', orders: 750 },
    // { name: 'Aug', orders: 670 },
    // { name: 'Sep', orders: 560 },
    // { name: 'Oct', orders: 590 },
    // { name: 'Nov', orders: 610 },
    // { name: 'Dec', orders: 720 }
    { name: 'Jan', orders: 0 },
    { name: 'Feb', orders: 0 },
    { name: 'Mar', orders: 0 },
    { name: 'Apr', orders: 0 },
    { name: 'May', orders: 0 },
    { name: 'Jun', orders: 0 },
    { name: 'Jul', orders: 0 },
    { name: 'Aug', orders: 0 },
    { name: 'Sep', orders: 0 },
    { name: 'Oct', orders: 0 },
    { name: 'Nov', orders: 0 },
    { name: 'Dec', orders: 0 }
  ] as StatisticModel[],
  selected: {
    name: "",
    orders: 0,
    year: new Date().getFullYear(),
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchStatistics: async (year: number) => {
    set({ loading: true });
    try {
      const res = await api.get(ENDPOINT, { params: { year } });

      set({
        data: res.data.data.items as StatisticModel[],
        total: res.data.data.total || res.data.data.items.length,
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
