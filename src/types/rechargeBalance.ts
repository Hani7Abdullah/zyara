import type { ClientModel } from "./client";
import type { BaseState } from "./common";

export interface RechargeBalanceModel {
  id: string;
  client: ClientModel;
  recipient_mobile_number: string;
  amount: number;
}

export interface RechargeBalanceState extends BaseState<RechargeBalanceModel> {
  fetchRechargeBalances: (page:number, per_page:number, search:string) => Promise<void>;
  setSelectedRechargeBalance: (rechargeBalance: RechargeBalanceModel) => void;
}