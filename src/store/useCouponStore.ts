import { create } from "zustand";
import type { CouponState, CouponModel } from "../types/coupon";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "coupons/accounts";

export const useCouponStore = create<CouponState>((set, get) => ({
  status: false,
  message: "",
  data: [] as CouponModel[],
  selected: {
    id: "",
    vendor_id: 0,
    vendor: {
      id: "",
      name: "",
      email: "",
      mobile_number: "",
      password: "",
      image: "",
      role_name: "",
      is_active: false,
      is_admin: false
    },
    name: "",
    arabic_name: "",
    start_date: "",
    end_date: "",
    code: "",
    type: "discount",
    discount: 0,
    for_all: false,
    clients: [],
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchCoupons: async (page = 0, per_page = 10, search = "") => {
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

  createCoupon: async (coupon) => {
    set({ loading: true });
    try {
      const res = await api.post<CouponModel>(ENDPOINT, coupon);
      set((state) => ({
        data: [res.data, ...(state.data as CouponModel[])],
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  updateCoupon: async (id, coupon) => {
    set({ loading: true });
    try {
      const res = await api.put<CouponModel>(`${ENDPOINT}/${id}`, coupon);
      set((state) => ({
        data: (state.data as CouponModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteCoupon: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as CouponModel[]).filter((a) => a.id !== id),
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
      const res = await api.put<CouponModel>(`${ENDPOINT}/${id}/switch-activation`);
      set((state) => ({
        data: (state.data as CouponModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedCoupon: (coupon) => set({ selected: coupon }),
}));
