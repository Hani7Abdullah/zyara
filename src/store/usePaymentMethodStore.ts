import { create } from "zustand";
import type { PaymentMethodState, PaymentMethodModel } from "../types/paymentMethod";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "payment-methods";

export const usePaymentMethodStore = create<PaymentMethodState>((set, get) => ({
  status: false,
  message: "",
  data: [] as PaymentMethodModel[],
  selected: {
    id: "",
    name: "",
    arabic_name: "",
    image: "",
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchPaymentMethods: async (page = 0, per_page = 10, search = "") => {
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
      const res = await api.put<PaymentMethodModel>(`${ENDPOINT}/${id}/switch-activation`);
      set((state) => ({
        data: (state.data as PaymentMethodModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedPaymentMethod: (paymentMethod) => set({ selected: paymentMethod }),
}));
