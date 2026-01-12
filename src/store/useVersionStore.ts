import { create } from "zustand";
import type { VersionState, VersionModel } from "../types/version";
import api from "../api";

const ENDPOINT = "versions";

export const useVersionStore = create<VersionState>((set, get) => ({
  status: false,
  message: "",
  data: [] as VersionModel[],
  selected: {
    id: "",
    version: "",
    platform: "android",
    currency: "",
    is_required: false,
    status: "draft",
    released_at: new Date()
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchVersions: async (page = 1, per_page = 10, search = "") => {
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

  createVersion: async (role) => {
      set({ loading: true });
      try {
        const res = await api.post(ENDPOINT, role);
        set((state)=>({
          data: [res.data.data, ...(state.data as VersionModel[])],
        }));
      } catch (err) {
        console.error(err);
      } finally {
        set({ loading: false });
      }
    },

   updateVersion: async (id, version) => {
    set({ loading: true });
    try {
      const res = await api.patch(`${ENDPOINT}/${id}`, version);
      set((state) => ({
        data: (state.data as VersionModel[]).map((v) => (v.id === id ? res.data.data : v)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },


   makePublish: async (id) => {
    set({ loading: true });
    try {
      const res = await api.patch(`${ENDPOINT}/${id}/publish`);
      set((state) => ({
        data: (state.data as VersionModel[]).map((v) => (v.id === id ? res.data.data : v)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedVersion: (version) => set({ selected: version }),
}));
