import type { AdminModel } from "./admin";
import type { VendorModel } from "./vendor";

export interface LoginModel {
  email: string;
  password: string;
}

export interface ChangePasswordModel {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface RequestResetPasswordModel {
  email: string;
}

export interface VerifyOtpModel {
  email: string;
  code: string;
}

export interface ResetPasswordModel {
  reset_token: string;
  password: string;
  password_confirmation: string;
}

export type AuthUser = AdminModel | VendorModel;

export interface AuthState {
  status: boolean;
  loading: boolean;
  message: string;
  data: {
    is_admin: boolean;
    access_token: string;
    refresh_token: string;
    profile: AuthUser & { 
      role_name: string;
      my_permissions: Record<string, boolean>; 
    };
  }

  login: (payload: LoginModel) => Promise<boolean>;
  logout: () => boolean;
  setToken: (token: string) => void;

  fetchProfile: () => Promise<boolean>;
  updateProfile: (payload: FormData) => Promise<boolean>;

  changePassword: (payload: ChangePasswordModel) => Promise<boolean>;
  requestResetPassword: (payload: RequestResetPasswordModel) => Promise<boolean>;
  verifyOtp: (payload: VerifyOtpModel) => Promise<string>;
  resetPassword: (payload: ResetPasswordModel) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
}
