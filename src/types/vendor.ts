import type { BaseState } from "./common";

export interface VendorModel {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  image: string;
  password: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface VendorState extends BaseState<VendorModel> {
  fetchVendors: (page:number, per_page:number, search:string) => Promise<void>;
  createVendor: (vendor: FormData) => Promise<void>;
  updateVendor: (id: number, vendor: FormData) => Promise<void>;
  deleteVendor: (id: number) => Promise<void>;
  switchActivation: (id: number) => Promise<void>;
  setSelectedVendor: (vendor: VendorModel) => void;
}
