// utils/currencies.ts
import currencyCodes from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";

export const currencyOptions = currencyCodes.data
  .map((c) => ({
    code: c.code,
    symbol: getSymbolFromCurrency(c.code) ?? "",
    name: c.currency,
  }))
  .filter((c) => c.symbol); // keep only usable ones
