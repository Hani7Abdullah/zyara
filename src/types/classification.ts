import type { BaseState } from "./common";

export interface ClassificationModel {
  id: number;
  name: string;
  arabic_name: string;
  icon: string;
  color: string;
  index: number;
  is_active: boolean;
}

export interface ClassificationState extends BaseState<ClassificationModel> {
  fetchClassifications: (page:number, per_page:number, search:string) => Promise<void>;
  createClassification: (classification: FormData) => Promise<void>;
  updateClassification: (id: number, classification: FormData) => Promise<void>;
  deleteClassification: (id: number) => Promise<void>;
  switchActivation: (id: number) => Promise<void>;
  setSelectedClassification: (classification: ClassificationModel) => void;
}
