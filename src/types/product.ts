import type { BaseState } from "./common";
import type { CategoryModel } from "./category";
import type { StoreModel } from "./store";

export interface SelectionOption {
    id: number;
    name: string;
    arabic_name: string;
    price_adjustment: number;
}

export interface SelectionRule {
    id: number;
    title: string;
    arabic_title: string;
    required: boolean;
    multiple: boolean;
    options: SelectionOption[];
}

export interface ProductModel {
    id: number;
    store_id: number;
    store: StoreModel;
    category_id: number;
    category: CategoryModel;
    name: string;
    arabic_name: string;
    description: string;
    arabic_description: string;
    image: string;
    price: number;
    quantity?: number | null;
    discount: number;
    is_active: boolean;
    is_recommended: boolean;
    selection_rules: SelectionRule[];
}

export interface ProductState extends BaseState<ProductModel> {
    fetchProducts: (page: number, per_page: number, search: string,filterType?:string, filterValue?: string) => Promise<ProductModel[]>;
    createProduct: (product: FormData) => Promise<void>;
    updateProduct: (id: number, product: FormData) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    switchActivation: (id: number) => Promise<void>;
    setSelectedProduct: (product: ProductModel) => void;
}