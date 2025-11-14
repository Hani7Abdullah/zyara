import type { ClientModel } from "./client";
import type { BaseState } from "./common";
import type { GiftCardModel } from "./giftCard";
import type { PaymentMethodModel, PaymentMethodStatus } from "./paymentMethod";

export interface GiftCardRequestModel {
  id: string;
  gift_card_id: string;
  gift_card: GiftCardModel;
  client_id: string;
  client: ClientModel;
  sender_name: string;
  recipient_name: string;
  recipient_mobile_number: string;
  payment_id: string;
  payment: PaymentMethodModel;
  payment_method_status: PaymentMethodStatus;
}

export interface GiftCardState extends BaseState<GiftCardRequestModel> {
  fetchGiftCardRequests: (page:number, per_page:number, search:string) => Promise<void>;
  setSelectedGiftCardRequest: (giftCardRequest: GiftCardRequestModel) => void;
}
