import { create } from "zustand";
import type { PermissionState, PermissionModel } from "../types/permission";
import api from "../api";
const ENDPOINT = "permissions";

export const usePermissionStore = create<PermissionState>((set) => ({
  status: false,
  message: "",
  data: [] as PermissionModel[],
  selected: {
    id: 0,
    name: "",
    arabic_name: ""
  },
  total: 0,
  loading: false,
  mode: "view",

  fetchPermissions: async (page = 1, per_page = 10, search = "") => {
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

  setSelectedPermission: (permission) => set({ selected: permission }),
}));
