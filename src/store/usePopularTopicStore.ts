import { create } from "zustand";
import type { PopularTopicState, PopularTopicModel } from "../types/popularTopic";
import api from "../api";

const ENDPOINT = "topics";

export const usePopularTopicStore = create<PopularTopicState>((set) => ({
  status: false,
  message: "",
  data: [] as PopularTopicModel[],
  selected: {
    id: "",
    question: "",
    arabic_question: "",
    answer: "",
    arabic_answer: "",
  },
  loading: false,
  mode: "view",
  total: 0,

  
  fetchPopularTopics: async (page = 1, per_page = 10, search = "") => {
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
  
    createPopularTopic: async (popularTopic) => {
      set({ loading: true });
      try {
        const res = await api.post(ENDPOINT, popularTopic);
        set((state) => ({
          data: [res.data.data, ...(state.data as PopularTopicModel[])],
        }));
      } catch (err) {
        console.error(err);
      } finally {
        set({ loading: false });
      }
    },
  
    updatePopularTopic: async (id, popularTopic) => {
      set({ loading: true });
      try {
        const res = await api.patch(`${ENDPOINT}/${id}`, popularTopic);
        set((state) => ({
          data: (state.data as PopularTopicModel[]).map((a) => (a.id === id ? res.data.data : a)),
        }));
      } catch (err) {
        console.error(err);
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
      } catch (err) {
        console.error(err);
      } finally {
        set({ loading: false });
      }
    },

  setSelectedPopularTopic: (popularTopic) => set({ selected: popularTopic }),
}));
