import axios, { AxiosError, type AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import { useAuthStore } from "../store/useAuthStore";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string | string[]>;
}

// Extend Axios config
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    showSuccess?: boolean;
    _retry?: boolean; // prevent infinite retry loops
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");

    config.headers = config.headers ?? {};

    // If calling refresh endpoint → use refresh token
    if (config.url?.includes("/refresh")) {
      if (refreshToken) {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
    } else if (token) {
      // Otherwise use normal access token
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle messages + 401 refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const status = response.data.status;
    const message = (response.data as { message?: string })?.message;

    // Skip showing success for refresh endpoint
    const isRefreshRequest = response.config.url?.includes("refresh");
    if (!isRefreshRequest && status && message) {
      enqueueSnackbar(message, { variant: "success" });
    }

    return response;
  },
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = error.config as any;

    const status = error.response?.status;

    // Handle 401 Unauthorized
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStore = useAuthStore.getState();
        const refreshed = await authStore.refreshToken();

        if (refreshed) {
          const newToken = localStorage.getItem("token");
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          // Retry the original request
          return api(originalRequest);
        } else {
          authStore.logout();
        }
      } catch {
        useAuthStore.getState().logout();
        enqueueSnackbar(t("session-expired"), { variant: "error" });
      }
    }

    // --- 403: Forbidden (no permission) ---
    if (status === 403) {
      // window.location.replace("/403");
    }

    // --- 404: Not Found ---
    if (status === 404) {
      // window.location.replace("/404");
    }

    const errorData = (error.response?.data || {}) as ApiErrorResponse;

    let message = t("something-went-wrong");

    if (errorData.message) {
      message = errorData.message;
    } else if (errorData.errors && typeof errorData.errors === "object") {
      // Collect all error messages into one string
      const allErrors = Object.values(errorData.errors)
        .flat() // In case some values are arrays
        .map((err) => (typeof err === "string" ? err : JSON.stringify(err)))
        .join("\n");
      if (allErrors) message = allErrors;
    } else if (error.message) {
      message = error.message;
    }

    if (status !== 401) {
      enqueueSnackbar(message, {
        variant: "error",
        style: { whiteSpace: "pre-line" },
      });
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
