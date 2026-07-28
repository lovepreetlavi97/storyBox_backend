import mongoose, { Schema } from 'mongoose';
import { IBannerDoc } from '../types/index.js';

const BannerSchema = new Schema<IBannerDoc>({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  linkType: { type: String, enum: ['audio', 'category', 'external'], required: true },
  linkValue: { type: String, required: true },
  published: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export const BannerModel = mongoose.model<IBannerDoc>('Banner', BannerSchema);
