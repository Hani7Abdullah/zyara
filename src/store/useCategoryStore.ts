import { create } from "zustand";
import type { CategoryState, CategoryModel } from "../types/category";
import api from "../api";

const ENDPOINT = "categories";

export const useCategoryStore = create<CategoryState>((set) => ({
  status: false,
  message: "",
  data: [] as CategoryModel[],
  vendorData: [] as CategoryModel[],
  vendorTotal: 0,
  selected: {
    id: 0,
    name: "",
    arabic_name: "",
    category_ids: [],
    store_ids: [],
    is_enabled: true,
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchCategories: async (page = 1, per_page = 10, search = "", filterType, filterValue) => {
    set({ loading: true });
    try {
      const params: Record<string, unknown> = { page, per_page, search };

      const hasFilterParams = filterType && filterValue !== undefined && filterValue !== null;
      if (hasFilterParams) {
        params[filterType] = filterValue;
      }

      const res = await api.get(ENDPOINT, { params });
      
      if (hasFilterParams) {
        set({
          vendorData: res.data.data,
          vendorTotal: res.data.pagination?.total || 0,
          status: res.data.status,
          message: res.data.message,
        });
      }

      else {
        set({
          data: res.data.data,
          total: res.data.pagination?.total || 0,
          status: res.data.status,
          message: res.data.message,
        });
      }
      return res.data.data;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, category);
      set((state) => ({
        data: [res.data.data, ...(state.data as CategoryModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  enableInStores: async (data) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/enable-in-stores`, data);
      set((state) => ({
        vendorData: [
          ...res.data.data,
          ...(state.vendorData as CategoryModel[]),
        ].filter(
          (obj, index, self) =>
            index === self.findIndex((o) => o.id === obj.id)
        ),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id, category) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/${id}`, category);
      set((state) => ({
        data: (state.data as CategoryModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as CategoryModel[]).filter((a) => a.id !== id),
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
        data: (state.data as CategoryModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteCategoryFromStore: async (storeId, categoryId) => {
    set({ loading: true });
    try {
      await api.delete(`categories/${categoryId}/stores/${storeId}`);
      set((state) => ({
        vendorData: (state.vendorData as CategoryModel[]).filter((a) => a.id !== categoryId),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  switchActivationInStore: async (storeId, categoryId) => {
    set({ loading: true });
    try {
      const res = await api.patch(`categories/${categoryId}/stores/${storeId}/switch`);
      set((state) => ({
        vendorData: (state.vendorData as CategoryModel[]).map((a) =>
          a.id === categoryId ? res.data.data : a
        ),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedCategory: (category) => set({ selected: category }),
}));
