import axios from "axios";

import { config } from "../config/configs";
import { Currency } from "../enums/currency.enum";
import { IConvertPrice } from "../interfaces/convert-price.interface";
import {
  IPrivatBankCurrency,
  IRates,
} from "../interfaces/exchangeRates.interface";
import { exchangeRateRepository } from "../repositories/exchangeRate.repository";

class CurrencyService {
  private cache: IRates | null = null;
  private lastUpdate: number | null = null;
  private readonly UPDATE_INTERVAL: number = 24 * 60 * 60 * 1000;

  private async fetchRates(): Promise<Omit<IRates, "date">> {
    const { data } = await axios.get<IPrivatBankCurrency[]>(
      config.PRIVAT_BANK_API,
    );

    const usd = data.find((c) => c.ccy === "USD");
    const eur = data.find((c) => c.ccy === "EUR");

    if (!usd || !eur) {
      throw new Error("Currency rates not found in API response");
    }

    return {
      usd: Number(usd.sale),
      eur: Number(eur.sale),
    };
  }

  private async getRates(): Promise<IRates> {
    const now = Date.now();

    if (
      !this.cache ||
      !this.lastUpdate ||
      now - this.lastUpdate > this.UPDATE_INTERVAL
    ) {
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

      const apiRates = await this.fetchRates();

      this.cache = {
        ...apiRates,
        date: new Date(),
      };

      this.lastUpdate = now;
    }

    return this.cache as IRates;
  }

  public async updateDailyRate(): Promise<void> {
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

  public async convertPrice(
    price: number,
    currency: Currency,
  ): Promise<IConvertPrice> {
    const rates = await this.getRates();

    let priceUAH = price;

    if (currency === Currency.USD) {
      priceUAH = price * rates.usd;
    } else if (currency === Currency.EUR) {
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

// import axios from "axios";
//
// import { config } from "../config/configs";
// import { Currency } from "../enums/currency.enum";
// import { IConvertPrice } from "../interfaces/convert-price.interface";
// import { exchangeRateRepository } from "../repositories/exchangeRate.repository";
//
// class CurrencyService {
//   private cache: {
//     usd: number;
//     eur: number;
//     date: Date;
//   } | null = null;
//
//   private lastUpdate: number | null = null;
//
//   private readonly UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
//
//   private async fetchRates() {
//     const response = await axios.get(config.PRIVAT_BANK_API);
//
//     const usd = response.data.find((c: any) => c.ccy === "USD");
//     const eur = response.data.find((c: any) => c.ccy === "EUR");
//
//     return {
//       usd: Number(usd.sale),
//       eur: Number(eur.sale),
//     };
//   }
//
//   private async getRates() {
//     const now = Date.now();
//
//     if (
//       !this.cache ||
//       !this.lastUpdate ||
//       now - this.lastUpdate > this.UPDATE_INTERVAL
//     ) {
//       const latest = await exchangeRateRepository.getLatest();
//
//       if (latest) {
//         this.cache = {
//           usd: latest.usd,
//           eur: latest.eur,
//           date: latest.date,
//         };
//
//         this.lastUpdate = now;
//         return this.cache;
//       }
//       const apiRates = await this.fetchRates();
//
//       this.cache = {
//         ...apiRates,
//         date: new Date(),
//       };
//
//       this.lastUpdate = now;
//     }
//
//     return this.cache!;
//   }
//
//   public async updateDailyRate() {
//     const rates = await this.fetchRates();
//
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//
//     await exchangeRateRepository.create({
//       base: "UAH",
//       usd: rates.usd,
//       eur: rates.eur,
//       source: "PrivatBank",
//       date: today,
//     });
//
//     this.cache = {
//       ...rates,
//       date: today,
//     };
//
//     this.lastUpdate = Date.now();
//   }
//
//   public async convertPrice(
//     price: number,
//     currency: Currency,
//   ): Promise<IConvertPrice> {
//     const rates = await this.getRates();
//
//     let priceUAH = price;
//
//     if (currency === Currency.USD) {
//       priceUAH = price * rates.usd;
//     }
//
//     if (currency === Currency.EUR) {
//       priceUAH = price * rates.eur;
//     }
//
//     return {
//       priceUAH: Math.round(priceUAH),
//       priceUSD: Math.round(priceUAH / rates.usd),
//       priceEUR: Math.round(priceUAH / rates.eur),
//       exchangeRateDate: rates.date,
//     };
//   }
// }
//
// export const currencyService = new CurrencyService();
