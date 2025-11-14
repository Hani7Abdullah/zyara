import { create } from "zustand";
import type { RechargeBalanceState, RechargeBalanceModel } from "../types/rechargeBalance";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "rechargeBalances/accounts";

export const useRechargeBalanceStore = create<RechargeBalanceState>((set, get) => ({
  status: false,
  message: "",
  data: [] as RechargeBalanceModel[],
  selected: {
    id: "",
    client: {
      id: "",
      full_name: "",
      email: "",
      mobile_number: "",
      country: "",
      birth_day: "",
      image: "",
      addresses: [],
      is_active: false
    },
    recipient_mobile_number: "",
    amount: 0
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchRechargeBalances: async (page = 0, per_page = 10, search = "") => {
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

  setSelectedRechargeBalance: (rechargeBalance) => set({ selected: rechargeBalance }),
}));
