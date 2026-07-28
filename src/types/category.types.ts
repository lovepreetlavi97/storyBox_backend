import { Document } from 'mongoose';

export interface ICategoryDoc extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
