import { create } from "zustand";
import type { CurrencyState, CurrencyModel } from "../types/currency";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "currencies";

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  status: false,
  message: "",
  data: [] as CurrencyModel[],
  selected: {
    id: 0,
    code: "",
    symbol: "",
    exchange_rate: 0,
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchCurrencies: async (page = 0, per_page = 10, search = "") => {
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

  switchActivation: async (id) => {
    set({ loading: true });
    try {
      const res = await api.put<CurrencyModel>(`${ENDPOINT}/${id}/switch-activation`);
      set((state) => ({
        data: (state.data as CurrencyModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedCurrency: (currency) => set({ selected: currency }),
}));
