import { CategoryModel, AudioModel } from '../models/index.js';

export const categoryService = {
  async getAll() {
    return await CategoryModel.find().sort({ name: 1 });
  },

  async create(data: { name: string; slug: string; description?: string }) {
    const category = new CategoryModel(data);
    await category.save();
    return category;
  },

  async update(id: string, data: { name?: string; slug?: string; description?: string }) {
    return await CategoryModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string) {
    const audioCount = await AudioModel.countDocuments({ category: id });
    if (audioCount > 0) {
      throw new Error(`Cannot delete category because it has ${audioCount} audio files associated with it.`);
    }
    return await CategoryModel.findByIdAndDelete(id);
  },

  async getBySlug(slug: string) {
    return await CategoryModel.findOne({ slug });
  }
};
