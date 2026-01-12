import { create } from "zustand";
import type { ClassificationState, ClassificationModel } from "../types/classification";
import api from "../api";

const ENDPOINT = "classifications";

export const useClassificationStore = create<ClassificationState>((set) => ({
  status: false,
  message: "",
  data: [] as ClassificationModel[],
  selected: {
    id: 0,
    name: "",
    arabic_name: "",
    icon: "",
    color: "",
    index: 0,
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchClassifications: async (page = 1, per_page = 10, search = "") => {
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

  createClassification: async (classification) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, classification, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: [res.data.data, ...(state.data as ClassificationModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateClassification: async (id, classification) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/${id}`, classification, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: (state.data as ClassificationModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteClassification: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as ClassificationModel[]).filter((a) => a.id !== id),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  switchActivation: async (id) => {
    set({ loading: true });
    try {
      const res = await api.patch(`${ENDPOINT}/${id}/switch`);
      set((state) => ({
        data: (state.data as ClassificationModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedClassification: (classification) => set({ selected: classification }),
}));
