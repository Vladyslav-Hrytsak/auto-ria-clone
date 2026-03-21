import { IExchangeRate } from "../interfaces/exchangeRates.interface";
import { ExchangeRate } from "../models/exchangeRate.model";

class ExchangeRateRepository {
  public async create(data: {
    base: string;
    usd: number;
    eur: number;
    date: Date;
    source?: string;
  }): Promise<IExchangeRate> {
    return await ExchangeRate.create(data);
  }

  public async getLatest(): Promise<IExchangeRate> {
    return await ExchangeRate.findOne().sort({ date: -1 });
  }
}

export const exchangeRateRepository = new ExchangeRateRepository();
