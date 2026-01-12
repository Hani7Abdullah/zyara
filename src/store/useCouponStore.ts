import { create } from "zustand";
import type { CouponState, CouponModel } from "../types/coupon";
import api from "../api";

const ENDPOINT = "coupons";

export const useCouponStore = create<CouponState>((set) => ({
  status: false,
  message: "",
  data: [] as CouponModel[],
  selected: {
    id: 0,
    vendor_id: 0,
    vendor: {
      id: 0,
      name: "",
      email: "",
      mobile_number: "",
      password: "",
      image: "",
      is_active: false,
      is_admin: false,
    },
    name: "",
    arabic_name: "",
    start_date: "",
    end_date: "",
    code: "",
    type: "discount",
    discount: 0,
    for_all_users: false,
    for_all_stores: false,
    users: [],
    stores: [],
    is_active: false,
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchCoupons: async (page = 1, per_page = 10, search = "", filterType, filterValue) => {
    set({ loading: true });
    try {
      const params: Record<string, unknown> = { page, per_page, search };

      const hasFilterParams = filterType && filterValue !== undefined && filterValue !== null;
      if (hasFilterParams) {
        params[filterType] = filterValue;
        console.log(filterType);
        console.log(filterValue);
      }

      const res = await api.get(ENDPOINT, { params });

      set({
        data: res.data.data,
        total: res.data.pagination?.total || 0,
        status: res.data.status,
        message: res.data.message,
      });

      return res.data.data;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  createCoupon: async (coupon) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, coupon);
      set((state) => ({
        data: [res.data.data, ...(state.data as CouponModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateCoupon: async (id, coupon) => {
    set({ loading: true });
    try {
      const res = await api.patch(`${ENDPOINT}/${id}`, coupon);
      set((state) => ({
        data: (state.data as CouponModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  switchActivation: async (id, storeId) => {
    set({ loading: true });
    try {
      const res = await api.patch(`${ENDPOINT}/${id}/stores/${storeId}/switch`);
      set((state) => ({
        data: (state.data as CouponModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedCoupon: (coupon) => set({ selected: coupon }),
}));
