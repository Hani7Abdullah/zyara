import { create } from "zustand";
import type { SliderState, SlideModel } from "../types/slide";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "slides/accounts";

export const useSlideStore = create<SliderState>((set, get) => ({
  status: false,
  message: "",
  data: [] as SlideModel[],
  selected: {
    id: "",
    image: "",
    start_date: "",
    end_date: "",
    type: "internal",
    priority: 0,
    store_id: "",
    store: null,
    owner: null,
    link: null,
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchSlider: async (page = 0, per_page = 10, search = "") => {
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

  createSlide: async (slide) => {
    set({ loading: true });
    try {
      const res = await api.post<SlideModel>(ENDPOINT, slide);
      set((state) => ({
        data: [res.data, ...(state.data as SlideModel[])],
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  updateSlide: async (id, slide) => {
    set({ loading: true });
    try {
      const res = await api.put<SlideModel>(`${ENDPOINT}/${id}`, slide);
      set((state) => ({
        data: (state.data as SlideModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
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
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  switchActivation: async (id) => {
    set({ loading: true });
    try {
      const res = await api.put<SlideModel>(`${ENDPOINT}/${id}/switch-activation`);
      set((state) => ({
        data: (state.data as SlideModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedSlide: (slide) => set({ selected: slide }),
}));
