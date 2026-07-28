import { AudioModel, CategoryModel } from '../models/index.js';
import { cleanupLocalFile } from '../utils/upload.util.js';

export const audioService = {
  async getPaginatedAudios(page: number = 1, limit: number = 10, search?: string) {
    const skip = (Number(page) - 1) * Number(limit);
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [audios, total] = await Promise.all([
      AudioModel.find(query)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AudioModel.countDocuments(query)
    ]);

    return {
      audios,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    };
  },

  async create(data: any) {
    const audio = new AudioModel({
      ...data,
      duration: Number(data.duration) || 0,
      featured: !!data.featured,
      trending: !!data.trending,
      published: data.published !== false
    });
    await audio.save();
    return audio;
  },

  async update(id: string, data: any) {
    return await AudioModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string) {
    const audio = await AudioModel.findByIdAndDelete(id);
    if (audio) {
      cleanupLocalFile(audio.thumbnailUrl);
      cleanupLocalFile(audio.audioUrl);
    }
    return audio;
  },

  async getFeatured() {
    return await AudioModel.find({ featured: true, published: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10);
  },

  async getTrending() {
    return await AudioModel.find({ trending: true, published: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10);
  },

  async getLatest() {
    return await AudioModel.find({ published: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10);
  },

  async getByCategory(categoryId: any) {
    return await AudioModel.find({ category: categoryId, published: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
  },

  async searchPublic(q?: string, categorySlugOrName?: string) {
    const query: any = { published: true };

    if (categorySlugOrName) {
      const cat = await CategoryModel.findOne({
        $or: [{ slug: categorySlugOrName }, { name: categorySlugOrName }]
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    return await AudioModel.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(30);
  },

  async getBySlug(slug: string) {
    return await AudioModel.findOne({ slug, published: true })
      .populate('category', 'name slug');
  },

  async getRelated(audioId: string) {
    const audio = await AudioModel.findOne({ _id: audioId, published: true });
    if (!audio) return null;

    return await AudioModel.find({
      category: audio.category,
      _id: { $ne: audio._id },
      published: true
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(6);
  }
};
