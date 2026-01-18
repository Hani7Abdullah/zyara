import { create } from "zustand";
import type { CurrencyState, CurrencyModel } from "../types/currency";
import api from "../api";

const ENDPOINT = "currencies";

export const useCurrencyStore = create<CurrencyState>((set) => ({
  status: false,
  message: "",
  data: [] as CurrencyModel[],
  selected: {
    id: 0,
    code: "",
    symbol: "",
    rate: 0
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchCurrencies: async (page = 1, per_page = 10, search = "") => {
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

  createCurrency: async (currency) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, currency, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: [res.data.data, ...(state.data as CurrencyModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateCurrency: async (id, currency) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/${id}`, currency, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: (state.data as CurrencyModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateCurrencyRate: async () => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/rates/update`);
      set({
        data: res.data.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteCurrency: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as CurrencyModel[]).filter((a) => a.id !== id),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedCurrency: (currency) => set({ selected: currency }),
}));
