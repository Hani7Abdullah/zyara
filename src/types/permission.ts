import type { BaseState } from "./common";

export interface PermissionModel {
  id: number;
  name: string;
  arabic_name: string;
}

export interface PermissionState extends BaseState<PermissionModel> {
  fetchPermissions: (page:number, per_page:number, search:string) => Promise<PermissionModel[]>;
  setSelectedPermission: (perm: PermissionModel) => void;
}
