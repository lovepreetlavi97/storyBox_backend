import { BannerModel } from '../models/index.js';
import { cleanupLocalFile } from '../utils/upload.util.js';

export const bannerService = {
  async getAll() {
    return await BannerModel.find().sort({ createdAt: -1 });
  },

  async getPublished() {
    return await BannerModel.find({ published: true }).sort({ createdAt: -1 });
  },

  async create(data: any) {
    const banner = new BannerModel({
      ...data,
      published: data.published !== false
    });
    await banner.save();
    return banner;
  },

  async update(id: string, data: any) {
    return await BannerModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string) {
    const banner = await BannerModel.findByIdAndDelete(id);
    if (banner) {
      cleanupLocalFile(banner.imageUrl);
    }
    return banner;
  }
};
