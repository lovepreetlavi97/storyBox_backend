import mongoose, { Document } from 'mongoose';

export interface IAudioDoc extends Document {
  title: string;
  description: string;
  slug: string;
  thumbnailUrl: string;
  audioUrl: string;
  duration: number;
  category: mongoose.Types.ObjectId;
  language?: string;
  featured: boolean;
  trending: boolean;
  published: boolean;
  lyrics?: string;
  createdAt: Date;
  updatedAt: Date;
}
