import { create } from "zustand";
import type { VersionState, VersionModel } from "../types/version";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "versions";

export const useVersionStore = create<VersionState>((set, get) => ({
  status: false,
  message: "",
  data: [] as VersionModel[],
  selected: {
    id: "",
    version: "",
    base_url: null,
    platform: "android",
    currency_id: "",
    currency: {
      id: "",
      code: "",
      symbol: "",
      exchange_rate: 0,
      is_active: false
    },
    is_required: false,
    status: "draft"
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchVersions: async (page = 0, per_page = 10, search = "") => {
    set({ loading: true });
    try {
      const res = await api.get(ENDPOINT, {
        params: { page: page + 1, per_page, search }, // include search
      });

      set({
        data: res.data.data.items,
        total: res.data.data.total || res.data.data.items.length,
        status: get().status,
        message: get().message,
      });

      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

   updateVersion: async (id, version) => {
    set({ loading: true });
    try {
      const res = await api.put<VersionModel>(`${ENDPOINT}/${id}`, version);
      set((state) => ({
        data: (state.data as VersionModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  makePublish: async (id) => {
    set({ loading: true });
    try {
      const res = await api.put<VersionModel>(`${ENDPOINT}/${id}/switch-activation`);
      set((state) => ({
        data: (state.data as VersionModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedVersion: (version) => set({ selected: version }),
}));
