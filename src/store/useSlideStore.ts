import { create } from "zustand";
import type { SliderState, SlideModel } from "../types/slide";
import api from "../api";

const ENDPOINT = "sliders";

export const useSlideStore = create<SliderState>((set) => ({
  status: false,
  message: "",
  data: [] as SlideModel[],
  selected: {
   id: 0,
    image: "",
    start_date: "",
    end_date: "",
    type: "internal",
    index: 0,
    store_id: 0,
    store: null,
    owner: null,
    link: null,
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchSlider: async (page = 1, per_page = 10, search = "") => {
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

  createSlide: async (slide) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, slide, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: [res.data.data, ...(state.data as SlideModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateSlide: async (id, slide) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/${id}`, slide, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: (state.data as SlideModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteSlide: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as SlideModel[]).filter((a) => a.id !== id),
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
        data: (state.data as SlideModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedSlide: (slide) => set({ selected: slide }),
}));
