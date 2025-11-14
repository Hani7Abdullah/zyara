import { create } from "zustand";
import type {
  AuthState,
  LoginModel,
  ChangePasswordModel,
  RequestResetPasswordModel,
  VerifyOtpModel,
  ResetPasswordModel,
  AuthUser,
} from "../types/auth";
import api from "../api";

export const useAuthStore = create<AuthState>((set, get) => ({
  status: false,
  loading: false,
  message: "",

  data: {
    is_admin: false,
    access_token: "",
    refresh_token: "",
    profile: {} as AuthUser & {
      role_name: string;
      my_permissions: Record<string, boolean>;
    }
  },

  setToken: (token: string) => {
    localStorage.setItem("token", token);
    set((state) => ({
      data: { ...state.data, access_token: token },
    }));
  },

  login: async (payload: LoginModel): Promise<boolean> => {
    try {
      const res = await api.post("login", payload);
      const { access_token, refresh_token, profile, is_admin, message } = res.data.data;

      set({
        status: true,
        message,
        data: { access_token, refresh_token, profile, is_admin },
      });

      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("is_admin", is_admin);
      localStorage.setItem("my_permissions", JSON.stringify(profile.my_permissions));
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("my_permissions");
    set({
      status: false,
      message: "",
      data: {
        is_admin: false,
        access_token: "",
        refresh_token: "",
        profile: {} as AuthUser & {
          role_name: string;
          my_permissions: Record<string, boolean>;
        }
      },
    });
    return true;
  },

  fetchProfile: async () => {
    try {
      const res = await api.get("/profile");
      const profile = res.data.data;
      set((state) => ({
        data: { ...state.data, profile },
      }));
      localStorage.setItem("my_permissions", JSON.stringify(profile.my_permissions));
      return true;
    } catch {
      return false;
    }
  },

  updateProfile: async (payload: FormData) => {
    try {
      const res = await api.post("/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({
        data: res.data.data,
        message: res.data.message,
      });
      return true;
    } catch {

      return false;
    }
  },

  changePassword: async (payload: ChangePasswordModel) => {
    try {
      await api.post("/change-password", payload);
      return true;
    } catch {
      return false;
    }
  },

  requestResetPassword: async (payload: RequestResetPasswordModel) => {
    try {
      await api.post("send-code", payload);
      return true;
    } catch {

      return false;
    }
  },

  verifyOtp: async (payload: VerifyOtpModel) => {
    try {
      const res = await api.post("check-otp", payload);
      return res.data.data.reset_token as string;
    } catch {
      return "";
    }
  },

  resetPassword: async (payload: ResetPasswordModel) => {
    try {
      await api.post("reset-password", payload);
      return true;
    } catch {

      return false;
    }
  },

  refreshToken: async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");

      if (refresh_token) {

        const res = await api.post("/refresh");

        const { access_token, refresh_token: newRefreshToken } = res.data.data;

        set((state) => ({
          data: { ...state.data, access_token, refresh_token: newRefreshToken },
        }));

        localStorage.setItem("token", access_token);
        localStorage.setItem("refresh_token", newRefreshToken);
      }

      return true;
    } catch {
      get().logout();
      window.location.replace("/login");
      return false;
    }
  },
}));