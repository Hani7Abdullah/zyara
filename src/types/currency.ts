import type { BaseState } from "./common";

export interface CurrencyModel {
    id: number;
    code: string;
    symbol: string;
    rate: number;
}

export interface CurrencyState extends BaseState<CurrencyModel> {
    fetchCurrencies: (page: number, per_page: number, search: string) => Promise<CurrencyModel[]>;
    createCurrency: (currency: FormData) => Promise<void>;
    updateCurrency: (id: number, currency: FormData) => Promise<void>;
    updateCurrencyRate: () => Promise<void>;
    deleteCurrency: (id: number) => Promise<void>;
    setSelectedCurrency: (currency: CurrencyModel) => void;
}
