import type { BaseState } from "./common";
import type { ClassificationModel } from "./classification";
import type { VendorModel } from "./vendor";

export type ServiceMethod = "Pickup" | "Delivery" | "Both";

export type Day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface WorkingDay {
  id: number;
  day: Day;
  opening_time: string;
  closing_time: string;
  is_vacation: boolean;
}

export interface StoreModel {
  id: number;
  classification_id: number;
  classification: ClassificationModel;
  vendor_id: number;
  vendor: VendorModel;
  brand: string;
  arabic_brand: string;
  logo: string;
  image: string;
  mobile_number: string;
  phone_number: string;
  address: string;
  arabic_address: string;
  is_active: boolean;
  service_method: ServiceMethod; 
  delivery_cost: number;
  delivery_duration: number;
  min_order_value: number;
  working_days: WorkingDay[];
}

export interface StoreState extends BaseState<StoreModel> {
  fetchStores: (page:number, per_page:number, search:string) => Promise<StoreModel[]>;
  createStore: (store: FormData) => Promise<void>;
  updateStore: (id: number, store: FormData) => Promise<void>;
  deleteStore: (id: number) => Promise<void>;
  switchActivation: (id: number) => Promise<void>;
  setSelectedStore: (store: StoreModel) => void;
}