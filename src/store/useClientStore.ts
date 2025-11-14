import { create } from "zustand";
import type { ClientState, ClientModel } from "../types/client";
import api from "../api";

const ENDPOINT = "users";

export const useClientStore = create<ClientState>((set) => ({
  status: false,
  message: "",
  data: [] as ClientModel[],
  selected: {
    id: 0,
    full_name: "",
    email: "",
    mobile_number: "",
    country: "",
    image: "",
    addresses: [],
    is_active: false
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchClients: async (page = 1, per_page = 10, search = "") => {
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

  switchActivation: async (id) => {
    set({ loading: true });
    try {
      const res = await api.put(`${ENDPOINT}/${id}/switch`);
      set((state) => ({
        data: (state.data as ClientModel[]).map((a) => (a.id === id ? res.data.data : a)),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedClient: (client) => set({ selected: client }),
}));
