import mongoose, { Schema } from 'mongoose';
import { ISettingsDoc } from '../types/index.js';

const SettingsSchema = new Schema<ISettingsDoc>({
  appTitle: { type: String, default: 'StoryHub' },
  contactEmail: { type: String, default: 'support@storyhub.com' },
  socialLinks: {
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  supportText: { type: String, default: '' }
}, { timestamps: true });

export const SettingsModel = mongoose.model<ISettingsDoc>('Settings', SettingsSchema);
