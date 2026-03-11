import { listingViewRepository } from "../repositories/listingView.repository";

class ListingViewService {
  public async addView(listingId: string) {
    await listingViewRepository.createView(listingId);
  }

  public async getViewsStats(listingId: string) {
    const now = new Date();

    const day = new Date(now);
    day.setDate(day.getDate() - 1);

    const week = new Date(now);
    week.setDate(week.getDate() - 7);

    const month = new Date(now);
    month.setMonth(month.getMonth() - 1);

    const total = await listingViewRepository.countViews(listingId);
    const daily = await listingViewRepository.countViewsSince(listingId, day);
    const weekly = await listingViewRepository.countViewsSince(listingId, week);
    const monthly = await listingViewRepository.countViewsSince(
      listingId,
      month,
    );

    return {
      total,
      daily,
      weekly,
      monthly,
    };
  }
}

export const listingViewService = new ListingViewService();
