import { Types } from "mongoose";

export interface IListingView {
  listing: Types.ObjectId;
  viewedAt: Date;
}

export interface IViewsStats {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
}

export interface IListingAnalytics {
  views: IViewsStats;
  averagePriceRegion: number;
  averagePriceUkraine: number;
}
