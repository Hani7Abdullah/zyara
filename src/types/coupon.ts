import type { ClientModel } from "./client";
import type { BaseState } from "./common";
import type { StoreModel } from "./store";
import type { VendorModel } from "./vendor";

export type CouponType = "discount" | "free_delivery";

export interface CouponModel {
    id: number;
    vendor_id: number;
    vendor: VendorModel;
    name: string;
    arabic_name: string;
    start_date: string;
    end_date: string;
    code: string;
    type: CouponType;
    discount: number;
    for_all_users: boolean;
    for_all_stores: boolean;
    users: ClientModel[] | number[];
    stores: StoreModel[] | number[];
    is_active: boolean;
}

export interface CouponState extends BaseState<CouponModel> {
  fetchCoupons: (page:number, per_page:number, search:string, filterType?:string, filterValue?: string) => Promise<CouponModel[]>;
  createCoupon: (coupon: Omit<CouponModel, "id"| "coupon_ids"| "store_ids"| "is_enabled">) => Promise<void>;
  updateCoupon: (id: number, coupon: Partial<CouponModel>) => Promise<void>;
  deleteCoupon: (id: number) => Promise<void>;
  switchActivation: (id: number, storeId:number) => Promise<void>;
  setSelectedCoupon: (coupon: CouponModel) => void;
}


