import { create } from "zustand";
import type { VendorState, VendorModel } from "../types/vendor";
import api from "../api";

const ENDPOINT = "vendors";

export const useVendorStore = create<VendorState>((set) => ({
  status: false,
  message: "",
  data: [] as VendorModel[],
  selected: {
    id: 0,
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    image: "",
    is_active: false,
    is_admin: false,
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchVendors: async (page = 1, per_page = 10, search = "") => {
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

  createVendor: async (vendor) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, vendor, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: [res.data.data, ...(state.data as VendorModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateVendor: async (id, vendor) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/${id}`, vendor, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: (state.data as VendorModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteVendor: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as VendorModel[]).filter((a) => a.id !== id),
      }));
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
        data: (state.data as VendorModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedVendor: (vendor) => set({ selected: vendor }),
}));
