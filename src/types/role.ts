import type { BaseState } from "./common";
import type { PermissionModel } from "./permission";

export interface RoleModel {
  id: number;
  name: string;
  arabic_name: string;
  permissions: PermissionModel[] | number[];
}

export interface RoleState extends BaseState<RoleModel> {
  fetchRoles: (page:number, per_page:number, search:string) => Promise<RoleModel[]>;
  createRole: (role: Omit<RoleModel, "id">) => Promise<void>;
  updateRole: (id: number, role: Partial<RoleModel>) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
  setSelectedRole: (role: RoleModel) => void;
}
