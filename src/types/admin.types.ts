import { Document } from 'mongoose';

export interface IAdminDoc extends Document {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
