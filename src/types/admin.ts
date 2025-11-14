import type { BaseState } from "./common";
import type { RoleModel } from "./role";

export interface AdminModel {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  image: string;
  password: string;
  role_id: number;
  role_name: string;
  role: RoleModel;
  is_active: boolean;
  is_admin: boolean;
}

export interface AdminState extends BaseState<AdminModel> {
  fetchAdmins: (page:number, per_page:number, search:string) => Promise<AdminModel[]>;
  createAdmin: (admin:FormData) => Promise<void>;
  updateAdmin: (id: number, admin: FormData) => Promise<void>;
  deleteAdmin: (id: number) => Promise<void>;
  switchActivation: (id: number) => Promise<void>;
  setSelectedAdmin: (admin: AdminModel) => void;
}
