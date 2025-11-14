import type { BaseState } from "./common";
import type { StoreModel } from "./store";

export type SlideType = "external" | "internal";

export interface Owner {
  name: string;
  email: string;
  mobile_number: string;
}

export interface SlideModel {
  id: string;
  image: string;
  start_date: string;
  end_date: string;
  type: SlideType;
  priority: number;
  store_id: string | null;
  store: StoreModel | null;
  owner: Owner | null;
  link: string | null;
  is_active: boolean;
}

export interface SliderState extends BaseState<SlideModel> {
  fetchSlider: (page: number, per_page: number, search: string) => Promise<void>;
  createSlide: (coupon: Omit<SlideModel, "id" | "store">) => Promise<void>;
  updateSlide: (id: string, coupon: Partial<SlideModel>) => Promise<void>;
  deleteSlide: (id: string) => Promise<void>;
  switchActivation: (id: string) => Promise<void>;
  setSelectedSlide: (slide: SlideModel) => void;
}