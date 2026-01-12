import { create } from "zustand";
import type { SettingState, SettingModel } from "../types/setting";
import api from "../api";

const ENDPOINT = "settings";

export const useSettingStore = create<SettingState>((set) => ({
    status: false,
    message: "",
    data: [] as SettingModel[],
    selected: {
        id: "",
        name: "",
        arabic_name: "",
        value: ""
    },
    loading: false,
    mode: "view",
    total: 0,

    fetchSettings: async (page = 1, per_page = 10, search = "") => {
        set({ loading: true });
        try {
          const res = await api.get(ENDPOINT, {
            params: { page, per_page, search }, // include search
          });
    
          set({
            data: res.data.data,
            total: res.data.pagination.total,
            status: res.data.status,
            message: res.data.message,
          });
          return res.data.data;
        } catch (err) {
          console.error(err);
        } finally {
          set({ loading: false });
        }
      },

    updateSetting: async (id, setting) => {
        set({ loading: true });
        try {
          const res = await api.patch(`${ENDPOINT}/${id}`, setting);
          set((state) => ({
            data: (state.data as SettingModel[]).map((s) => (s.id === id ? res.data.data : s)),
          }));
        } catch (err) {
          console.error(err);
        } finally {
          set({ loading: false });
        }
      },

    setSelectedSetting: (setting) => set({ selected: setting }),
}));
