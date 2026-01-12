import { create } from "zustand";
import type { SystemInformationState, SystemInformationModel } from "../types/systemInformation";
import api from "../api";

const ENDPOINT = "information";

export const useSystemInformationStore = create<SystemInformationState>((set) => ({
    status: false,
    message: "",
    data: [] as SystemInformationModel[],
    selected: {
        id: "",
        name: "",
        content: "",
        arabic_content: ""
    },
    loading: false,
    mode: "view",
    total: 0,

    fetchSystemInformation: async (page = 1, per_page = 10, search = "") => {
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

    updateSystemInformation: async (id, systemInformation) => {
        set({ loading: true });
        try {
          const res = await api.patch(`${ENDPOINT}/${id}`, systemInformation);
          set((state) => ({
            data: (state.data as SystemInformationModel[]).map((s) => (s.id === id ? res.data.data : s)),
          }));
        } catch (err) {
          console.error(err);
        } finally {
          set({ loading: false });
        }
      },

    setSelectedSystemInformation: (systemInformation) => set({ selected: systemInformation }),
}));
