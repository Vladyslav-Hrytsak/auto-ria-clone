export interface IExchangeRate extends Document {
  base: string;
  usd: number;
  eur: number;
  source: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
