import React from 'react';
import type { BaseState } from "./common";

export interface CountType {
    name: string,
    path: string,
    count: number,
    icon: React.ReactNode
}

export interface CountModel {
    categories: number;
    products: number;
    stores: number;
    users: number;
}

export interface CountState extends BaseState<CountModel> {
  fetchCounts: () => Promise<void>;
  setSelectedCount: (count: CountModel) => void;
}


