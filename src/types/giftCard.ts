import type { ClassificationModel } from "./classification";
import type { BaseState } from "./common";

export type GiftCardType = 'internal'| 'external';

export interface ExtenalStore {
  id: string;
  name: string;
  arabic_name: string;
  logo: string;
  address: string;
  mobile_number: string;
}

export interface GiftCardModel {
  id: string;
  title: string;
  arabic_title: string;
  summary: string;
  arabic_summary: string;
  description: string;
  arabic_description: string;
  price: number;
  cost: number;
  color: string;
  icon: string;
  classifications: string[] | ClassificationModel[];
  type: GiftCardType;
  external_stores: ExtenalStore[];
  expiration_date: string;
  is_active: boolean;
}

export interface GiftCardState extends BaseState<GiftCardModel> {
  fetchGiftCards: (page:number, per_page:number, search:string) => Promise<void>;
  createGiftCard: (giftCard: Omit<GiftCardModel, "id">) => Promise<void>;
  updateGiftCard: (id: string, giftCard: Partial<GiftCardModel>) => Promise<void>;
  deleteGiftCard: (id: string) => Promise<void>;
  switchActivation: (id: string) => Promise<void>;
  setSelectedGiftCard: (giftCard: GiftCardModel) => void;
}
