import { create } from "zustand";
import type { StoreState, StoreModel } from "../types/store";
import api from "../api";

const ENDPOINT = "stores";

export const useStore = create<StoreState>((set) => ({
  status: false,
  message: "",
  data: [] as StoreModel[],
  selected: {
    id: 0,
    classification_id: 0,
    classification: {
      id: 0,
      name: "",
      arabic_name: "",
      icon: "",
      color: "",
      is_active: false,
      sort: 0
    },
    vendor_id: 0,
    vendor: {
      id: 0,
      name: "",
      email: "",
      mobile_number: "",
      password: "",
      image: "",
      is_admin: false,
      is_active: false
    },
    brand: "",
    arabic_brand: "",
    logo: "",
    image: "",
    mobile_number: "",
    phone_number: "",
    address: "",
    arabic_address: "",
    is_active: false,
    service_method: "Both",
    delivery_cost: 0,
    delivery_duration: 0,
    min_order_value: 0,
    working_days: []
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchStores: async (page = 1, per_page = 10, search = "") => {
    set({ loading: true });
    try {
      const res = await api.get(ENDPOINT, {
        params: { page, per_page, search }, 
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

  createStore: async (store) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, store, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: [res.data.data, ...(state.data as StoreModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateStore: async (id, store) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/${id}`, store, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: (state.data as StoreModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteStore: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as StoreModel[]).filter((a) => a.id !== id),
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
      const res = await api.put(`${ENDPOINT}/${id}/switch`);
      set((state) => ({
        data: (state.data as StoreModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedStore: (store) => set({ selected: store }),
}));
