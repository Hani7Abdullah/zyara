import { create } from "zustand";
import type { PopularTopicState, PopularTopicModel } from "../types/popularTopic";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "popularTopics";

export const usePopularTopicStore = create<PopularTopicState>((set, get) => ({
  status: false,
  message: "",
  data: [] as PopularTopicModel[],
  selected: {
    id: "",
    title: "",
    arabic_title: "",
    description: "",
    arabic_description: "",
    priority: 0
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchPopularTopics: async (page = 0, per_page = 10, search = "") => {
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

  createPopularTopic: async (popularTopic) => {
    set({ loading: true });
    try {
      const res = await api.post<PopularTopicModel>(ENDPOINT, popularTopic);
      set((state) => ({
        data: [res.data, ...(state.data as PopularTopicModel[])],
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  updatePopularTopic: async (id, popularTopic) => {
    set({ loading: true });
    try {
      const res = await api.put<PopularTopicModel>(`${ENDPOINT}/${id}`, popularTopic);
      set((state) => ({
        data: (state.data as PopularTopicModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  deletePopularTopic: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as PopularTopicModel[]).filter((a) => a.id !== id),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedPopularTopic: (popularTopic) => set({ selected: popularTopic }),
}));
