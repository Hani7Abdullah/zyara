import { create } from "zustand";
import type { SettingState, SettingModel } from "../types/setting";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "settings";

export const useSettingStore = create<SettingState>((set, get) => ({
    status: false,
    message: "",
    data: [] as SettingModel[],
    selected: {
        id: "",
        name: "",
        arabic_name: "",
        value: ""
    },
    loading: false,
    mode: "view",
    total: 0,

    fetchSettings: async (page = 0, per_page = 10, search = "") => {
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


    updateSetting: async (id, setting) => {
        set({ loading: true });
        try {
            const res = await api.put<SettingModel>(`${ENDPOINT}/${id}`, setting);
            set((state) => ({
                data: (state.data as SettingModel[]).map((a) => (a.id === id ? res.data : a)),
            }));
            handleApiSuccess(get().message);
        } catch (err) {
            handleApiError(err);
        } finally {
            set({ loading: false });
        }
    },

    setSelectedSetting: (setting) => set({ selected: setting }),
}));
