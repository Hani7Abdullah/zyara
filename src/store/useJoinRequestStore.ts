import { create } from "zustand";
import type { JoinRequestState, JoinRequestModel } from "../types/joinRequest";
import api from "../api";

const ENDPOINT = "join-requests";

export const useJoinRequestStore = create<JoinRequestState>((set) => ({
  status: false,
  message: "",
  data: [] as JoinRequestModel[],
  selected: {
    id: "",
    user: {
      id: "",
      full_name: "",
    email: "",
    mobile_number: "",
    country: "",
    image: "",
    addresses: [],
    is_active: false
    },
    classification: "",
    store_name: ""
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchJoinRequests: async (page = 1, per_page = 10, search = "") => {
      set({ loading: true });
      try {
        const res = await api.get(ENDPOINT, {
          params: { page, per_page, search }, // include search
        });
  
        set({
          data: res.data.data,
          total: res.data.pagination.total,
          status: res.data.status,
          message: res.data.joinRequest,
        });
        return res.data.data;
      } catch (err) {
        console.error(err);
      } finally {
        set({ loading: false });
      }
    },

  setSelectedJoinRequest: (joinRequest) => set({ selected: joinRequest }),
}));
