import type { BaseState } from "./common";

export type PaymentMethodStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface PaymentMethodModel {
  id: string;
  name: string;
  arabic_name: string;
  image: string;
  is_active: boolean;
}

export interface PaymentMethodState extends BaseState<PaymentMethodModel> {
  fetchPaymentMethods: (page:number, per_page:number, search:string) => Promise<void>;
  setSelectedPaymentMethod: (perm: PaymentMethodModel) => void;
  switchActivation: (id: string) => Promise<void>;
}