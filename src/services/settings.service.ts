import { SettingsModel } from '../models/index.js';

export const settingsService = {
  async getSettings() {
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = new SettingsModel();
      await settings.save();
    }
    return settings;
  },

  async updateSettings(data: any) {
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = new SettingsModel(data);
    } else {
      Object.assign(settings, data);
    }
    await settings.save();
    return settings;
  }
};
