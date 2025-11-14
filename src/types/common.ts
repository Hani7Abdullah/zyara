export interface BaseState<T> {
  status: boolean;
  message: string;
  data: T | T[];
  selected: T;
  loading: boolean;
  mode: CRUDMode;
  total: number;
}

export type CRUDMode = "create" | "update" | "delete" | "view";

