import type { BaseState } from "./common";

export interface StatisticRequestModel {
  year: number;
}

export interface StatisticItemModel {
  month: string;
  orders: number;
}

export interface StatisticModel {
  year: number;
  data: StatisticItemModel[]
}

export interface StatisticState extends BaseState<StatisticModel> {
  fetchStatistics: (year: number) => Promise<void>;
  setSelectedStatistic: (statistic: StatisticModel) => void;
}