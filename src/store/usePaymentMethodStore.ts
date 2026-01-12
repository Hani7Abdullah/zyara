import { create } from "zustand";
import type { PaymentMethodState, PaymentMethodModel } from "../types/paymentMethod";
import api from "../api";

const ENDPOINT = "payment-methods";

export const usePaymentMethodStore = create<PaymentMethodState>((set) => ({
  status: false,
  message: "",
  data: [] as PaymentMethodModel[],
  selected: {
    id: 0,
    name: "",
    arabic_name: "",
    image: "",
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchPaymentMethods: async (page = 1, per_page = 10, search = "") => {
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

  switchActivation: async (id) => {
    set({ loading: true });
    try {
      const res = await api.patch(`${ENDPOINT}/${id}/switch`);
      set((state) => ({
        data: (state.data as PaymentMethodModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedPaymentMethod: (paymentMethod) => set({ selected: paymentMethod }),
}));
