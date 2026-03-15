import { ExchangeRate } from "../models/exchangeRate.model";

class ExchangeRateRepository {
  public async create(data: {
    base: string;
    usd: number;
    eur: number;
    date: Date;
    source?: string;
  }) {
    return await ExchangeRate.create(data);
  }

  public async getLatest() {
    return await ExchangeRate.findOne().sort({ date: -1 });
  }
}

export const exchangeRateRepository = new ExchangeRateRepository();
