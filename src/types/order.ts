import type { ClientModel } from "./client";
import type { CouponModel } from "./coupon";
import type { ProductModel } from "./product";
import type { StoreModel } from "./store";
import type { PaymentMethodModel, PaymentMethodStatus } from "./paymentMethod";
import type { AddressModel } from "./address";
import type { BaseState } from "./common";

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'on_way' | 'completed' | 'cancelled';
export type OrderType = 'asap' | 'schedule';
export type ArrivalInstruction = 'do_not_ring' | 'contact_me';

export interface OrderItemModel {
  id: string;
  product_id: string;
  product: ProductModel;
  quantity: number;
  special_request: string;
}

export interface OrderModel {
  id: string;
  store_id: string;
  store: StoreModel;
  client_id: string;
  client: ClientModel;
  address_id: string;
  address: AddressModel;
  order_number: string;
  status: OrderStatus;
  reason: string;
  coupon_id: string;
  coupon: CouponModel;
  payment_id: string;
  payment: PaymentMethodModel;
  payment_status: PaymentMethodStatus;
  order_type: OrderType;
  scheduled_date: string;
  arrival_instruction: ArrivalInstruction;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  items: OrderItemModel[];
}

export interface OrderState extends BaseState<OrderModel> {
  fetchOrders: (page:number, per_page:number, search:string) => Promise<void>;
  changeStatus: (id: string) => Promise<void>;
  setSelectedOrder: (order: OrderModel) => void;
}
