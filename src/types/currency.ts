import type { BaseState } from "./common";

export interface CurrencyModel {
    id: number;
    code: string;
    symbol: string;
    exchange_rate: number;
    is_active: boolean;
}

export interface CurrencyState extends BaseState<CurrencyModel> {
    fetchCurrencies: (page: number, per_page: number, search: string) => Promise<CurrencyModel[]>;
    switchActivation: (id: string) => Promise<void>;
    setSelectedCurrency: (currency: CurrencyModel) => void;
}