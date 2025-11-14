import { create } from "zustand";
import type { RoleState, RoleModel } from "../types/role";
import api from "../api";

const ENDPOINT = "roles";

export const useRoleStore = create<RoleState>((set) => ({
  status: false,
  message: "",
  data: [] as RoleModel[],
  selected: {
    id: 0,
    name: "",
    arabic_name: "",
    permissions: []
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchRoles: async (page = 1, per_page = 10, search = "") => {
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

  createRole: async (role) => {
    set({ loading: true });
    try {
      const res = await api.post(ENDPOINT, role);
      set((state)=>({
        data: [res.data.data, ...(state.data as RoleModel[])],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateRole: async (id, role) => {
    set({ loading: true });
    try {
      const res = await api.put(`${ENDPOINT}/${id}`, role);
      set((state) => ({
        data: (state.data as RoleModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteRole: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as RoleModel[]).filter((a) => a.id !== id),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedRole: (role) => set({ selected: role }),
}));
