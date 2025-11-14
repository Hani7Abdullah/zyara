import { create } from "zustand";
import type { GiftCardState, GiftCardModel } from "../types/giftCard";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "giftCards/accounts";

export const useGiftCardStore = create<GiftCardState>((set, get) => ({
  status: false,
  message: "",
  data: [
    {
      id: "1",
      title: "Zyara Classic",
      arabic_title: "زيارة كلاسيك",
      summary: "Everyday care, sent with love.",
      arabic_summary: "عناية يومية، تُرسل مع الحب.",
      description: "Perfect for daily use and thoughtful gifts.",
      arabic_description: "مثالي للاستخدام اليومي والهدايا المميزة.",
      price: 250000,
      cost: 275000,
      color: "#d35400",
      icon: "",
      classifications: [],
      type: "internal",
      external_stores: [],
      expiration_date: "2026-01-01",
      is_active: true,
    },
    {
      id: "2",
      title: "Zyara Pulse",
      arabic_title: "زيارة بالس",
      summary: "A small gesture, a strong connection.",
      arabic_summary: "إيماءة صغيرة، علاقة قوية.",
      description: "Share your care with style.",
      arabic_description: "شارك اهتمامك بأناقة.",
      price: 500000,
      cost: 550000,
      color: "#27ae60",
      icon: "",
      classifications: [],
      type: "internal",
      external_stores: [],
      expiration_date: "2026-06-01",
      is_active: true,
    }
  ] as GiftCardModel[],
  selected: {
    id: "",
    title: "",
    arabic_title: "",
    summary: "",
    arabic_summary: "",
    description: "",
    arabic_description: "",
    price: 0,
    cost: 0,
    color: "#000000",
    icon: "",
    classifications: [],
    type: 'internal',
    external_stores: [],
    expiration_date: "",
    is_active: true,
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchGiftCards: async (page = 0, per_page = 10, search = "") => {
    set({ loading: true });
    try {
      const res = await api.get(ENDPOINT, {
        params: { page: page + 1, per_page, search }, // include search
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

  createGiftCard: async (giftCard) => {
    set({ loading: true });
    try {
      const res = await api.post<GiftCardModel>(ENDPOINT, giftCard);
      set((state) => ({
        data: [res.data, ...(state.data as GiftCardModel[])],
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  updateGiftCard: async (id, giftCard) => {
    set({ loading: true });
    try {
      const res = await api.put<GiftCardModel>(`${ENDPOINT}/${id}`, giftCard);
      set((state) => ({
        data: (state.data as GiftCardModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteGiftCard: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      set((state) => ({
        data: (state.data as GiftCardModel[]).filter((a) => a.id !== id),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  switchActivation: async (id) => {
    set({ loading: true });
    try {
      const res = await api.put<GiftCardModel>(`${ENDPOINT}/${id}/switch-activation`);
      set((state) => ({
        data: (state.data as GiftCardModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedGiftCard: (giftCard) => set({ selected: giftCard }),
}));
