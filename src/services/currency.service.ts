import axios from "axios";

import { config } from "../config/configs";
import { Currency } from "../enums/currency.enum";
import { ExchangeRates } from "../interfaces/exchangeRates.interface";

class CurrencyService {
  private rates: ExchangeRates | null = null;
  private lastUpdate: number | null = null;

  private readonly UPDATE_INTERVAL = 24 * 60 * 60 * 1000;

  private async fetchRates(): Promise<ExchangeRates> {
    const response = await axios.get(config.PRIVAT_BANK_API);

    const usd = response.data.find((c: any) => c.ccy === "USD");
    const eur = response.data.find((c: any) => c.ccy === "EUR");

    return {
      USD: Number(usd.sale),
      EUR: Number(eur.sale),
    };
  }

  private async getRates(): Promise<ExchangeRates> {
    const now = Date.now();

    if (
      !this.rates ||
      !this.lastUpdate ||
      now - this.lastUpdate > this.UPDATE_INTERVAL
    ) {
      {
        this.rates = await this.fetchRates();
        this.lastUpdate = now;
      }

      return this.rates;
    }
    return this.rates!;
  }

  public async convertPrice(price: number, currency: Currency) {
    const rates = await this.getRates();

    let priceUAH: number;

    if (currency === Currency.UAH) {
      priceUAH = price;
    }

    if (currency === Currency.USD) {
      priceUAH = price * rates.USD;
    }

    if (currency === Currency.EUR) {
      priceUAH = price * rates.EUR;
    }

    const priceUSD = priceUAH / rates.USD;
    const priceEUR = priceUAH / rates.EUR;

    return {
      priceUAH: Math.round(priceUAH),
      priceUSD: Math.round(priceUSD),
      priceEUR: Math.round(priceEUR),
      exchangeRate:
        currency === Currency.USD
          ? rates.USD
          : currency === Currency.EUR
            ? rates.EUR
            : 1,
    };
  }
}

export const currencyService = new CurrencyService();
