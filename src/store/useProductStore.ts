import { create } from "zustand";
import type { ProductState, ProductModel } from "../types/product";
import api from "../api";

const ENDPOINT = "products";

export const useProductStore = create<ProductState>((set) => ({
  status: false,
  message: "",
  data: [] as ProductModel[],
  selected: {
    id: 0,
    store_id: 0,
    store: {
      id: 0,
      classification_id: 0,
      classification: {
        id: 0,
        name: "",
        arabic_name: "",
        icon: "",
        color: "",
        is_active: false,
        index: 0
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
    category_id: 0,
    category: {
      id: 0,
      name: "",
      arabic_name: "",
      category_ids: [],
      store_ids: [],
      is_enabled: false
    },
    name: "",
    arabic_name: "",
    description: "",
    arabic_description: "",
    image: "",
    price: 0,
    quantity: 0,
    discount: 0,
    is_active: false,
    is_recommended: false,
    selection_rules: []
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchProducts: async (page = 1, per_page = 10, search = "",filterType, filterValue) => {
    set({ loading: true });
    try {

       const params: Record<string, unknown> = { page, per_page, search };

      const hasFilterParams = filterType && filterValue !== undefined && filterValue !== null;
      if (hasFilterParams) {
        params[filterType] = filterValue;
      }

      const res = await api.get(ENDPOINT, {params});

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

  createProduct: async (product) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, product, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: [res.data.data, ...(state.data as ProductModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/${id}`, product, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: (state.data as ProductModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as ProductModel[]).filter((a) => a.id !== id),
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
        data: (state.data as ProductModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedProduct: (product) => set({ selected: product }),
}));
