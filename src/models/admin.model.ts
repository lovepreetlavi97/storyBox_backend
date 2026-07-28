import mongoose, { Schema } from 'mongoose';
import { IAdminDoc } from '../types/index.js';

const AdminSchema = new Schema<IAdminDoc>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

export const AdminModel = mongoose.model<IAdminDoc>('Admin', AdminSchema);
