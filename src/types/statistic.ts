import type { BaseState } from "./common";

export interface StatisticRequestModel {
  year: number;
}

export interface StatisticModel {
  name: string;
  orders: number;
}

export interface StatisticState extends BaseState<StatisticModel> {
  fetchStatistics: (year: number) => Promise<void>;
  setSelectedStatistic: (statistic: StatisticModel) => void;
}