import mongoose, { Schema } from 'mongoose';
import { IAudioDoc } from '../types/index.js';

const AudioSchema = new Schema<IAudioDoc>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  thumbnailUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, required: true, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  language: { type: String, default: 'English', index: true },
  featured: { type: Boolean, default: false, index: true },
  trending: { type: Boolean, default: false, index: true },
  published: { type: Boolean, default: true, index: true }
}, { timestamps: true });

// Multi-key/Text indexes for fast searching and filtering
AudioSchema.index({ title: 'text', description: 'text' }, { language_override: 'none' });
// Compounding indexes for performance
AudioSchema.index({ category: 1, published: 1 });
AudioSchema.index({ featured: 1, published: 1 });
AudioSchema.index({ trending: 1, published: 1 });
AudioSchema.index({ createdAt: -1, published: 1 });

export const AudioModel = mongoose.model<IAudioDoc>('Audio', AudioSchema);
