import { create } from "zustand";
import type { SystemInformationState, SystemInformationModel } from "../types/systemInformation";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "pages";

export const useSystemInformationStore = create<SystemInformationState>((set, get) => ({
    status: false,
    message: "",
    data: [] as SystemInformationModel[],
    selected: {
        id: "",
        name: "",
        arabic_name: "",
        content: "",
        arabic_content: ""
    },
    loading: false,
    mode: "view",
    total: 0,

    fetchSystemInformation: async (page = 0, per_page = 10, search = "") => {
        set({ loading: true });
        try {
            const res = await api.get(ENDPOINT, {
                params: { page: page + 1, per_page, search },
            });

            set({
                data: res.data.data.items,
                total: res.data.data.total || res.data.data.items.length,
                status: get().status,
                message: get().message,
            });

            handleApiSuccess(get().message);
        } catch (err) {
            handleApiError(err);
        } finally {
            set({ loading: false });
        }
    },

    updateSystemInformation: async (id, systemInformation) => {
        set({ loading: true });
        try {
            const res = await api.put<SystemInformationModel>(`${ENDPOINT}/${id}`, systemInformation);
            set((state) => ({
                data: (state.data as SystemInformationModel[]).map((a) => (a.id === id ? res.data : a)),
            }));
            handleApiSuccess(get().message);
        } catch (err) {
            handleApiError(err);
        } finally {
            set({ loading: false });
        }
    },

    setSelectedSystemInformation: (systemInformation) => set({ selected: systemInformation }),
}));
