import type { BaseState } from "./common";
import type { StoreModel } from "./store";

export type SlideType = "external" | "internal";

export interface Owner {
  name: string;
  email: string;
  mobile_number: string;
}

export interface SlideModel {
  id: number;
  image: string;
  start_date: string;
  end_date: string;
  type: SlideType;
  index: number;
  store_id: number | null;
  store: StoreModel | null;
  owner: Owner | null;
  link: string | null;
  is_active: boolean;
}

export interface SliderState extends BaseState<SlideModel> {
  fetchSlider: (page: number, per_page: number, search: string) => Promise<SlideModel[]>;
  createSlide: (slide: FormData) => Promise<void>;
  updateSlide: (id: number, slide:FormData ) => Promise<void>;
  deleteSlide: (id: number) => Promise<void>;
  switchActivation: (id: number) => Promise<void>;
  setSelectedSlide: (slide: SlideModel) => void;
}