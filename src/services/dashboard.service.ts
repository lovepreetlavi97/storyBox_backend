import { AudioModel, CategoryModel, BannerModel } from '../models/index.js';

export const dashboardService = {
  async getStats() {
    const [totalAudios, totalCategories, totalBanners] = await Promise.all([
      AudioModel.countDocuments(),
      CategoryModel.countDocuments(),
      BannerModel.countDocuments()
    ]);

    const latestAudios = await AudioModel.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      totalAudios,
      totalCategories,
      totalBanners,
      latestAudios
    };
  }
};
