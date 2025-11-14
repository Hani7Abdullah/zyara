import { create } from "zustand";
import type { OrderState, OrderModel } from "../types/order";
import api from "../api";
import { handleApiError } from "../api/apiErrorHandler";
import { handleApiSuccess } from "../api/apiSuccessHandler";

const ENDPOINT = "orders";

export const useOrderStore = create<OrderState>((set, get) => ({
  status: false,
  message: "",
  data: [] as OrderModel[],
  selected: {
    id: "",
    store_id: "",
    store: {
      id: "",
      classification_id: "",
      classification: {
        id: "",
        name: "",
        arabic_name: "",
        icon: "",
        color: "",
        is_active: false
      },
      vendor_id: "",
      vendor: {
        id: "",
        name: "",
        email: "",
        mobile_number: "",
        password: "",
        image: "",
        role_name: "",
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
      is_active: false,
      service_method: "both",
      delivery_cost: 0,
      delivery_duration: 0,
      min_order_value: 0,
      working_days: []
    },
    client_id: "",
    client: {
      id: "",
      full_name: "",
      email: "",
      mobile_number: "",
      country: "",
      birth_day: "",
      image: "",
      addresses: [],
      is_active: false
    },
    address_id: "",
    address: {
      id: "",
      country: "",
      city: "",
      area: "",
      address_name: "",
      street: "",
      floor: "",
      delivery_instruction: ""
    },
    order_number: "",
    status: "pending",
    reason: "",
    coupon_id: "",
    coupon: {
      id: "",
      vendor_id: 0,
      vendor: {
        id: "",
        name: "",
        email: "",
        mobile_number: "",
        password: "",
        image: "",
        role_name: "",
        is_active: false,
        is_admin: false
      },
      name: "",
      arabic_name: "",
      start_date: "",
      end_date: "",
      code: "",
      type: "discount",
      discount: 0,
      for_all: false,
      clients: [],
      is_active: false
    },
    payment_id: "",
    payment: {
      id: "",
      name: "",
      arabic_name: "",
      image: "",
      is_active: false
    },
    payment_status: "pending",
    order_type: "asap",
    scheduled_date: "",
    arrival_instruction: "contact_me",
    subtotal: 0,
    delivery_fee: 0,
    tax: 0,
    items: [],
  },
  loading: false,
  mode: "view",
  total: 0,

  fetchOrders: async (page = 0, per_page = 10, search = "") => {
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

  changeStatus: async (id) => {
    set({ loading: true });
    try {
      const res = await api.put<OrderModel>(`${ENDPOINT}/${id}/switch-activation`);
      set((state) => ({
        data: (state.data as OrderModel[]).map((a) => (a.id === id ? res.data : a)),
      }));
      handleApiSuccess(get().message);
    } catch (err) {
      handleApiError(err);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedOrder: (order) => set({ selected: order }),
}));
