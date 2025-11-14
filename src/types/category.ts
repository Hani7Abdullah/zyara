import type { BaseState } from "./common";

export interface CategoryModel {
  id: number;
  name: string;
  arabic_name: string;
  category_ids: number[];
  store_ids: number[];
  is_enabled: boolean;
}

export interface CategoryState extends BaseState<CategoryModel> {
  vendorData:CategoryModel[],
  vendorTotal: number,
  fetchCategories: (page:number, per_page:number, search:string, filterType?:string, filterValue?: string) => Promise<CategoryModel[]>;
  createCategory: (category: Omit<CategoryModel, "id"| "category_ids"| "store_ids"| "is_enabled">) => Promise<void>;
  updateCategory: (id: number, category: Partial<CategoryModel>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  switchActivation: (id: number) => Promise<void>;
  deleteCategoryFromStore: (storeId: number, categoryId: number) => Promise<void>;
  enableInStores: (ccategory: Omit<CategoryModel, "id"| "name"| "arabic_name" | "is_enabled">) => Promise<void>;
  switchActivationInStore: (storeId: number, categoryId: number) => Promise<void>;
  setSelectedCategory: (category: CategoryModel) => void;
}
