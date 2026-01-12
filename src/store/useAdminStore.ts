import { create } from "zustand";
import type { AdminState, AdminModel } from "../types/admin";
import api from "../api";

const ENDPOINT = "admins";

export const useAdminStore = create<AdminState>((set) => ({
  status: false,
  message: "",
  data: [] as AdminModel[],
  selected: {
    id: 0,
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    image: "",
    role: {
      id: 0,
      name: "",
      arabic_name: "",
      permissions: []
    },
    role_id: 0,
    role_name: "",
    is_admin: false,
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchAdmins: async (page = 1, per_page = 10, search = "") => {
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

  createAdmin: async (admin) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, admin, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: [res.data.data, ...(state.data as AdminModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateAdmin: async (id, admin) => {
    set({ loading: true });
    try {
      const res = await api.post(`${ENDPOINT}/${id}`, admin, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        data: (state.data as AdminModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteAdmin: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as AdminModel[]).filter((a) => a.id !== id),
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
        data: (state.data as AdminModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedAdmin: (admin) => set({ selected: admin }),
}));
