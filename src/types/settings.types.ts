import { Document } from 'mongoose';

export interface ISettingsDoc extends Document {
  appTitle: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  supportText?: string;
  createdAt: Date;
  updatedAt: Date;
}
