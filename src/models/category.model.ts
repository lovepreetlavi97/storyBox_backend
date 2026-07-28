import mongoose, { Schema } from 'mongoose';
import { ICategoryDoc } from '../types/index.js';

const CategorySchema = new Schema<ICategoryDoc>({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String }
}, { timestamps: true });

export const CategoryModel = mongoose.model<ICategoryDoc>('Category', CategorySchema);
