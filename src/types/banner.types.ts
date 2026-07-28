import { Document } from 'mongoose';

export interface IBannerDoc extends Document {
  imageUrl: string;
  title: string;
  description?: string;
  linkType: 'audio' | 'category' | 'external';
  linkValue: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
