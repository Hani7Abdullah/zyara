import type { ClientModel } from "./client";
import type { BaseState } from "./common";
import type { VendorModel } from "./vendor";

export type CouponType = "discount" | "free_delivery";

export interface CouponModel {
    id: string;
    vendor_id: number;
    vendor: VendorModel;
    name: string;
    arabic_name: string;
    start_date: string;
    end_date: string;
    code: string;
    type: CouponType;
    discount: number;
    for_all: boolean;
    clients: ClientModel[] | number[];
    is_active: boolean;
}

export interface CouponState extends BaseState<CouponModel> {
    fetchCoupons: (page: number, per_page: number, search: string) => Promise<void>;
    createCoupon: (coupon: Omit<CouponModel, "id" | "vendor">) => Promise<void>;
    updateCoupon: (id: string, coupon: Partial<CouponModel>) => Promise<void>;
    deleteCoupon: (id: string) => Promise<void>;
    switchActivation: (id: string) => Promise<void>;
    setSelectedCoupon: (coupon: CouponModel) => void;
}
