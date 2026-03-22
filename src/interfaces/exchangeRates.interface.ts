export interface IExchangeRate extends Document {
  base: string;
  usd: number;
  eur: number;
  source: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPrivatBankCurrency {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

export interface IRates {
  usd: number;
  eur: number;
  date: Date;
}
