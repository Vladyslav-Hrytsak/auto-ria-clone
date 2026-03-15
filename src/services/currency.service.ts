import axios from "axios";

import { config } from "../config/configs";
import { Currency } from "../enums/currency.enum";
import { exchangeRateRepository } from "../repositories/exchangeRate.repository";

class CurrencyService {
  private cache: {
    usd: number;
    eur: number;
    date: Date;
  } | null = null;

  private lastUpdate: number | null = null;

  private readonly UPDATE_INTERVAL = 24 * 60 * 60 * 1000;

  private async fetchRates() {
    const response = await axios.get(config.PRIVAT_BANK_API);

    const usd = response.data.find((c: any) => c.ccy === "USD");
    const eur = response.data.find((c: any) => c.ccy === "EUR");

    return {
      usd: Number(usd.sale),
      eur: Number(eur.sale),
    };
  }

  private async getRates() {
    const now = Date.now();

    if (
      !this.cache ||
      !this.lastUpdate ||
      now - this.lastUpdate > this.UPDATE_INTERVAL
    ) {
      /**
       * пробуем взять из базы
       */
      const latest = await exchangeRateRepository.getLatest();

      if (latest) {
        this.cache = {
          usd: latest.usd,
          eur: latest.eur,
          date: latest.date,
        };

        this.lastUpdate = now;
        return this.cache;
      }

      /**
       * fallback если база пустая
       */
      const apiRates = await this.fetchRates();

      this.cache = {
        ...apiRates,
        date: new Date(),
      };

      this.lastUpdate = now;
    }

    return this.cache!;
  }

  public async updateDailyRate() {
    const rates = await this.fetchRates();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await exchangeRateRepository.create({
      base: "UAH",
      usd: rates.usd,
      eur: rates.eur,
      source: "PrivatBank",
      date: today,
    });

    this.cache = {
      ...rates,
      date: today,
    };

    this.lastUpdate = Date.now();
  }

  public async convertPrice(price: number, currency: Currency) {
    const rates = await this.getRates();

    let priceUAH = price;

    if (currency === Currency.USD) {
      priceUAH = price * rates.usd;
    }

    if (currency === Currency.EUR) {
      priceUAH = price * rates.eur;
    }

    return {
      priceUAH: Math.round(priceUAH),
      priceUSD: Math.round(priceUAH / rates.usd),
      priceEUR: Math.round(priceUAH / rates.eur),
      exchangeRateDate: rates.date,
    };
  }
}

export const currencyService = new CurrencyService();
